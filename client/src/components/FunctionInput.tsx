import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../store/app-store';
import { parseFunction } from '../lib/functions';
import { Complex } from '../lib/complex';
import { QuadraticFunction } from '../lib/functions';

export function FunctionInput() {
  const { currentFunction, setFunction } = useAppStore();
  const [expression, setExpression] = useState(currentFunction.expression);
  const [realC, setRealC] = useState('0.5');
  const [imagC, setImagC] = useState('0.3');

  const handleUpdateFunction = () => {
    try {
      // Parse the expression or use the coefficient inputs
      if (expression.includes('z²') || expression.includes('z^2')) {
        const realValue = parseFloat(realC) || 0;
        const imagValue = parseFloat(imagC) || 0;
        const c = new Complex(realValue, imagValue);
        const func = new QuadraticFunction(Complex.one(), Complex.zero(), c);
        setFunction(func);
      } else {
        const func = parseFunction(expression);
        setFunction(func);
      }
    } catch (error) {
      console.error('Failed to parse function:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <i className="fas fa-function text-primary mr-2"></i>
          Function Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="function-input" className="text-sm font-medium">Complex Function f(z)</Label>
          <Input
            id="function-input"
            type="text"
            placeholder="z^2 + c"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="font-mono text-sm mt-2"
            data-testid="input-function"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="real-c" className="text-xs font-medium text-muted-foreground">Real(c)</Label>
            <Input
              id="real-c"
              type="number"
              step="0.1"
              value={realC}
              onChange={(e) => setRealC(e.target.value)}
              className="text-sm mt-1"
              data-testid="input-real-c"
            />
          </div>
          <div>
            <Label htmlFor="imag-c" className="text-xs font-medium text-muted-foreground">Imag(c)</Label>
            <Input
              id="imag-c"
              type="number"
              step="0.1"
              value={imagC}
              onChange={(e) => setImagC(e.target.value)}
              className="text-sm mt-1"
              data-testid="input-imag-c"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleUpdateFunction}
          className="w-full"
          data-testid="button-update-visualization"
        >
          Update Visualization
        </Button>
      </CardContent>
    </Card>
  );
}
