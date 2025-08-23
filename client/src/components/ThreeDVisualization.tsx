import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../store/app-store';
import { QuadraticFunction } from '../lib/functions';
import { Complex } from '../lib/complex';

// Função auxiliar para converter HSV para RGB, usada para o domain coloring na superfície
// H (Hue): Matiz, representa a fase do número complexo (0 a 360 graus, mapeado para 0 a 1)
// S (Saturation): Saturação, geralmente 1 para cores vibrantes
// V (Value): Valor/Brilho, representa o módulo do número complexo (0 a 1)
function hsvToRgb(h: number, s: number, v: number): {r: number, g: number, b: number} {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Enhanced 3D visualization component with domain coloring
const Visualizer3D: React.FC<{ 
  function: QuadraticFunction; 
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  style?: React.CSSProperties;
}> = ({ function: func, bounds, style }) => {
  const { xMin, xMax, yMin, yMax } = bounds;
  const numPoints = 50; // Define a resolução do grid para a superfície (50x50 pontos)

  const xValues: number[] = []; // Valores do eixo Real (Re(z))
  const yValues: number[] = []; // Valores do eixo Imaginário (Im(z))
  const zValues: number[][] = []; // Valores do eixo Z, representando |f(z)|
  const colors: string[][] = []; // Matriz de cores para o domain coloring na superfície

  // Loop para preencher os valores do grid
  for (let i = 0; i < numPoints; i++) {
    const rowZ: number[] = []; // Linha de valores Z para a matriz
    const rowColors: string[] = []; // Linha de cores para a matriz
    
    // Calcula o valor real (x) para a posição atual no grid
    const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
    xValues.push(x);

    for (let j = 0; j < numPoints; j++) {
      // Calcula o valor imaginário (y) para a posição atual no grid
      const y = yMin + (j / (numPoints - 1)) * (yMax - yMin);
      if (i === 0) yValues.push(y); // Adiciona yValues apenas uma vez (na primeira iteração de i)

      // Cria o número complexo z = x + iy
      const z_complex = new Complex(x, y);
      // Avalia a função quadrática f(z) = az^2 + bz + c
      const f_z = func.evaluate(z_complex);

      // Adiciona o módulo de f(z) à matriz Z (altura da superfície)
      rowZ.push(f_z.magnitude());

      // Calcula o matiz (hue) a partir do argumento (fase) de f(z)
      // Normaliza a fase para o intervalo [0, 1] para uso no HSV
      const hue = (f_z.argument() + Math.PI) / (2 * Math.PI);
      const saturation = 1; // Saturação total para cores vibrantes
      // Normaliza o módulo para o brilho (value), limitando para evitar valores muito altos
      const value = Math.min(1, f_z.magnitude() / 10); 
      
      // Converte HSV para RGB e adiciona a cor à matriz de cores
      const rgb = hsvToRgb(hue, saturation, value);
      rowColors.push(`rgb(${rgb.r},${rgb.g},${rgb.b})`);
    }
    zValues.push(rowZ);
    colors.push(rowColors);
  }

  // Configuração dos dados para o Plotly.js
  const data: Plotly.Data[] = [
    {
      type: 'surface', // Tipo de gráfico: superfície 3D
      x: xValues, // Valores do eixo X (Re(z))
      y: yValues, // Valores do eixo Y (Im(z))
      z: zValues, // Valores do eixo Z (|f(z)|)
      surfacecolor: colors, // Aplica a matriz de cores para colorir a superfície
      colorbar: { title: 'Fase de f(z)' }, // Adiciona uma barra de cores para indicar a fase
      colorscale: 'Viridis', // Colorscale padrão, mas as cores são definidas por surfacecolor
    },
  ];

  // Configuração do layout do gráfico
  const layout: Partial<Plotly.Layout> = {
    title: `|f(z)| Surface Plot - ${func.expression}`, // Título do gráfico
    autosize: true, // Ajusta o tamanho do gráfico automaticamente
    margin: { l: 0, r: 0, b: 0, t: 30 }, // Margens para ocupar o máximo de espaço
    scene: { // Configurações da cena 3D
      xaxis: { title: 'Re(z)' }, // Título do eixo X
      yaxis: { title: 'Im(z)' }, // Título do eixo Y
      zaxis: { title: '|f(z)|' }, // Título do eixo Z
      aspectmode: 'cube', // Proporção dos eixos para um cubo
    },
  };

  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true} // Permite que o gráfico se redimensione com o container
      style={style || { width: '100%', height: '100%' }} // Ocupa 100% do container
      config={{ responsive: true, displaylogo: false }} // Torna o gráfico responsivo
    />
  );
};

export function ThreeDVisualization() {
  const { currentFunction, bounds } = useAppStore();
  const [showFullView, setShowFullView] = useState(false);

  const handleViewFull3D = () => {
    setShowFullView(true);
  };

  const handleCloseFullView = () => {
    setShowFullView(false);
  };

  // Only render if we have a QuadraticFunction
  if (!(currentFunction instanceof QuadraticFunction)) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <i className="fas fa-cube text-primary mr-2"></i>
            3D Surface View
          </h3>
          <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
            <div className="text-center">
              <i className="fas fa-exclamation-circle text-3xl text-muted-foreground mb-2"></i>
              <p className="text-sm text-muted-foreground">3D visualization available for quadratic functions only</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showFullView) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">3D Surface Visualization com Domain Coloring</h2>
          <Button onClick={handleCloseFullView} variant="outline" size="sm">
            <i className="fas fa-times mr-2"></i>Close
          </Button>
        </div>
        <div className="w-full h-[calc(100vh-80px)]">
          <Visualizer3D 
            function={currentFunction}
            bounds={bounds}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <i className="fas fa-cube text-primary mr-2"></i>
          3D Surface View
        </h3>
        
        <div 
          className="w-full h-48 mb-3"
          data-testid="container-3d-visualization"
        >
          <Visualizer3D 
            function={currentFunction}
            bounds={bounds}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleViewFull3D}
            className="flex-1 text-sm"
            data-testid="button-view-full-3d"
          >
            View Full 3D
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3"
            data-testid="button-expand-3d"
          >
            <i className="fas fa-expand"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
