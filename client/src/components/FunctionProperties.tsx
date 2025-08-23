import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '../store/app-store';
import { QuadraticFunction } from '../lib/functions';

export function FunctionProperties() {
  const { currentFunction } = useAppStore();

  const getProperties = () => {
    if (currentFunction instanceof QuadraticFunction) {
      try {
        const roots = currentFunction.getRoots();
        const vertex = currentFunction.getVertex();
        const criticalPoints = currentFunction.getCriticalPoints();

        return {
          type: 'Quadratic Polynomial',
          roots: roots,
          vertex: vertex,
          criticalPoints: criticalPoints,
          behavior: 'Maps unit circle to ellipse-like shape'
        };
      } catch (error) {
        return {
          type: 'Quadratic Polynomial',
          roots: [],
          vertex: null,
          criticalPoints: [],
          behavior: 'Function analysis unavailable'
        };
      }
    }

    return {
      type: 'Complex Function',
      roots: [],
      vertex: null,
      criticalPoints: [],
      behavior: 'General complex transformation'
    };
  };

  const properties = getProperties();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <i className="fas fa-info-circle text-primary mr-2"></i>
          Function Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium text-foreground mb-2">Function Type</div>
          <div className="text-sm text-muted-foreground font-mono" data-testid="text-function-type">
            {properties.type}
          </div>
        </div>
        
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium text-foreground mb-2">Expression</div>
          <div className="text-sm text-muted-foreground font-mono" data-testid="text-function-expression">
            f(z) = {currentFunction.expression}
          </div>
        </div>

        {properties.roots.length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">Roots</div>
            <div className="space-y-1">
              {properties.roots.map((root, index) => (
                <div key={index} className="text-sm text-muted-foreground font-mono" data-testid={`text-root-${index + 1}`}>
                  z₁ = {root.toString()}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {properties.criticalPoints.length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">Critical Points</div>
            <div className="space-y-1">
              {properties.criticalPoints.map((point, index) => (
                <div key={index} className="text-sm text-muted-foreground font-mono" data-testid={`text-critical-point-${index}`}>
                  z₀ = {point.toString()}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium text-foreground mb-2">Behavior</div>
          <div className="text-sm text-muted-foreground" data-testid="text-behavior">
            {properties.behavior}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
