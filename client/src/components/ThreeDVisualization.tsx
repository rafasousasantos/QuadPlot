import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../store/app-store';
import { Complex } from '../lib/complex';

// Dynamically import Plotly to avoid SSR issues
const PlotlyComponent = React.lazy(() => 
  import('plotly.js-dist-min').then((module: any) => ({
    default: ({ data, layout, config, style }: any) => {
      const plotRef = useRef<HTMLDivElement>(null);
      
      useEffect(() => {
        if (plotRef.current && module.default) {
          module.default.newPlot(plotRef.current, data, layout, config);
          
          return () => {
            if (plotRef.current) {
              module.default.purge(plotRef.current);
            }
          };
        }
      }, [data, layout, config]);
      
      return <div ref={plotRef} style={style} />;
    }
  })).catch(() => ({
    default: ({ style }: any) => (
      <div style={style} className="flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-3xl text-muted-foreground mb-2"></i>
          <p className="text-sm text-muted-foreground">3D visualization temporarily unavailable</p>
        </div>
      </div>
    )
  }))
);

export function ThreeDVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentFunction, bounds } = useAppStore();
  const [showFullView, setShowFullView] = useState(false);

  const generateSurfaceData = () => {
    const resolution = 40; // Lower resolution for performance
    const xRange = Array.from({ length: resolution }, (_, i) => 
      bounds.xMin + (i / (resolution - 1)) * (bounds.xMax - bounds.xMin)
    );
    const yRange = Array.from({ length: resolution }, (_, i) => 
      bounds.yMin + (i / (resolution - 1)) * (bounds.yMax - bounds.yMin)
    );
    
    const zData = yRange.map(y => 
      xRange.map(x => {
        const z = new Complex(x, y);
        const result = currentFunction.evaluate(z);
        const magnitude = result.magnitude();
        
        // Clamp extreme values for better visualization
        return Math.min(magnitude, 10);
      })
    );

    return {
      data: [{
        type: 'surface',
        x: xRange,
        y: yRange,
        z: zData,
        colorscale: 'Viridis',
        showscale: true,
        colorbar: {
          title: '|f(z)|',
          titleside: 'right'
        },
        hovertemplate: 
          'Re(z): %{x:.2f}<br>' +
          'Im(z): %{y:.2f}<br>' +
          '|f(z)|: %{z:.2f}<extra></extra>'
      }],
      layout: {
        title: `3D Surface: |${currentFunction.expression}|`,
        scene: {
          xaxis: { title: 'Re(z)' },
          yaxis: { title: 'Im(z)' },
          zaxis: { title: '|f(z)|' },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.5 }
          }
        },
        margin: { t: 40, r: 0, b: 0, l: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      },
      config: {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d']
      }
    };
  };

  const handleViewFull3D = () => {
    setShowFullView(true);
  };

  const handleCloseFullView = () => {
    setShowFullView(false);
  };

  const surfaceData = generateSurfaceData();

  if (showFullView) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">3D Surface Visualization</h2>
          <Button onClick={handleCloseFullView} variant="outline" size="sm">
            <i className="fas fa-times mr-2"></i>Close
          </Button>
        </div>
        <div className="w-full h-[calc(100vh-80px)]">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                <p>Loading 3D visualization...</p>
              </div>
            </div>
          }>
            <PlotlyComponent 
              {...surfaceData}
              style={{ width: '100%', height: '100%' }}
            />
          </React.Suspense>
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
          ref={containerRef}
          className="w-full h-48 mb-3"
          data-testid="container-3d-visualization"
        >
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-primary mb-2"></i>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          }>
            <PlotlyComponent 
              {...surfaceData}
              style={{ width: '100%', height: '100%' }}
            />
          </React.Suspense>
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
