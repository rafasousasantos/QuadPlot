import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AnalysisTools() {
  const handleShowJuliaSet = () => {
    console.log('Showing Julia set analysis');
  };

  const handleShowMandelbrot = () => {
    console.log('Showing Mandelbrot connection');
  };

  const handleShowDerivative = () => {
    console.log('Showing derivative analysis');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-calculator text-primary mr-2"></i>
            Analysis Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full text-left p-3 h-auto justify-start"
            onClick={handleShowJuliaSet}
            data-testid="button-julia-set"
          >
            <div>
              <div className="font-medium text-sm">Julia Set</div>
              <div className="text-xs text-muted-foreground mt-1">View associated Julia set</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full text-left p-3 h-auto justify-start"
            onClick={handleShowMandelbrot}
            data-testid="button-mandelbrot"
          >
            <div>
              <div className="font-medium text-sm">Mandelbrot Connection</div>
              <div className="text-xs text-muted-foreground mt-1">Show parameter space</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full text-left p-3 h-auto justify-start"
            onClick={handleShowDerivative}
            data-testid="button-derivative"
          >
            <div>
              <div className="font-medium text-sm">Derivative Analysis</div>
              <div className="text-xs text-muted-foreground mt-1">f'(z) = 2z visualization</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-graduation-cap text-primary mr-2"></i>
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a 
            href="#" 
            className="block p-3 text-left border border-border rounded-lg hover:bg-muted transition-colors"
            data-testid="link-chapter-3"
          >
            <div className="font-medium text-sm text-primary">Marco G. Soares - Chapter 3</div>
            <div className="text-xs text-muted-foreground mt-1">Quadratic transformations theory</div>
          </a>
          
          <a 
            href="#" 
            className="block p-3 text-left border border-border rounded-lg hover:bg-muted transition-colors"
            data-testid="link-domain-coloring"
          >
            <div className="font-medium text-sm text-primary">Domain Coloring Guide</div>
            <div className="text-xs text-muted-foreground mt-1">Understanding color mappings</div>
          </a>
          
          <a 
            href="#" 
            className="block p-3 text-left border border-border rounded-lg hover:bg-muted transition-colors"
            data-testid="link-exercise-solutions"
          >
            <div className="font-medium text-sm text-primary">Exercise Solutions</div>
            <div className="text-xs text-muted-foreground mt-1">Step-by-step solutions</div>
          </a>
        </CardContent>
      </Card>
    </>
  );
}
