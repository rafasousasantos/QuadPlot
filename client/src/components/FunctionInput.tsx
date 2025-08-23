import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '../store/app-store';
import { parseFunction } from '../lib/functions';
import { Complex } from '../lib/complex';
import { QuadraticFunction } from '../lib/functions';

export function FunctionInput() {
  const { currentFunction, setFunction } = useAppStore();
  const [expression, setExpression] = useState(currentFunction.expression);
  
  // Enhanced coefficient inputs as discussed in the technical specification
  const [realA, setRealA] = useState('1');
  const [imagA, setImagA] = useState('0');
  const [realB, setRealB] = useState('0');
  const [imagB, setImagB] = useState('0');
  const [realC, setRealC] = useState('0.5');
  const [imagC, setImagC] = useState('0.3');

  // Update coefficients when function changes externally
  useEffect(() => {
    if (currentFunction instanceof QuadraticFunction) {
      // Extract coefficients if possible (this would need function introspection)
      setExpression(currentFunction.expression);
    }
  }, [currentFunction]);

  const handleUpdateFromCoefficients = () => {
    try {
      const a = new Complex(parseFloat(realA) || 0, parseFloat(imagA) || 0);
      const b = new Complex(parseFloat(realB) || 0, parseFloat(imagB) || 0);
      const c = new Complex(parseFloat(realC) || 0, parseFloat(imagC) || 0);
      
      const func = new QuadraticFunction(a, b, c);
      setFunction(func);
      
      // Update expression to match coefficients
      setExpression(func.expression);
    } catch (error) {
      console.error('Failed to create function from coefficients:', error);
    }
  };

  const handleUpdateFromExpression = () => {
    try {
      const func = parseFunction(expression);
      setFunction(func);
    } catch (error) {
      console.error('Failed to parse function:', error);
    }
  };

  const formatCoefficient = (real: string, imag: string) => {
    const r = parseFloat(real) || 0;
    const i = parseFloat(imag) || 0;
    return new Complex(r, i).toString();
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
        {/* Expression Input */}
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
          <Button 
            onClick={handleUpdateFromExpression}
            variant="outline"
            size="sm"
            className="w-full mt-2"
            data-testid="button-update-from-expression"
          >
            Parse Expression
          </Button>
        </div>
        
        <Separator />
        
        {/* Enhanced Coefficient Inputs */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quadratic Form: az² + bz + c</Label>
          
          {/* Coefficient a */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Coefficient a</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label htmlFor="real-a" className="text-xs text-muted-foreground">Re(a)</Label>
                  <Input
                    id="real-a"
                    type="number"
                    step="0.1"
                    value={realA}
                    onChange={(e) => setRealA(e.target.value)}
                    className="text-sm"
                    data-testid="input-real-a"
                  />
                </div>
                <div>
                  <Label htmlFor="imag-a" className="text-xs text-muted-foreground">Im(a)</Label>
                  <Input
                    id="imag-a"
                    type="number"
                    step="0.1"
                    value={imagA}
                    onChange={(e) => setImagA(e.target.value)}
                    className="text-sm"
                    data-testid="input-imag-a"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">
                a = {formatCoefficient(realA, imagA)}
              </div>
            </div>

            {/* Coefficient b */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Coefficient b</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label htmlFor="real-b" className="text-xs text-muted-foreground">Re(b)</Label>
                  <Input
                    id="real-b"
                    type="number"
                    step="0.1"
                    value={realB}
                    onChange={(e) => setRealB(e.target.value)}
                    className="text-sm"
                    data-testid="input-real-b"
                  />
                </div>
                <div>
                  <Label htmlFor="imag-b" className="text-xs text-muted-foreground">Im(b)</Label>
                  <Input
                    id="imag-b"
                    type="number"
                    step="0.1"
                    value={imagB}
                    onChange={(e) => setImagB(e.target.value)}
                    className="text-sm"
                    data-testid="input-imag-b"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">
                b = {formatCoefficient(realB, imagB)}
              </div>
            </div>

            {/* Coefficient c */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Coefficient c</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label htmlFor="real-c" className="text-xs text-muted-foreground">Re(c)</Label>
                  <Input
                    id="real-c"
                    type="number"
                    step="0.1"
                    value={realC}
                    onChange={(e) => setRealC(e.target.value)}
                    className="text-sm"
                    data-testid="input-real-c"
                  />
                </div>
                <div>
                  <Label htmlFor="imag-c" className="text-xs text-muted-foreground">Im(c)</Label>
                  <Input
                    id="imag-c"
                    type="number"
                    step="0.1"
                    value={imagC}
                    onChange={(e) => setImagC(e.target.value)}
                    className="text-sm"
                    data-testid="input-imag-c"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">
                c = {formatCoefficient(realC, imagC)}
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleUpdateFromCoefficients}
          className="w-full"
          data-testid="button-update-visualization"
        >
          <i className="fas fa-sync mr-2"></i>
          Update Visualization
        </Button>
      </CardContent>
    </Card>
  );
}
