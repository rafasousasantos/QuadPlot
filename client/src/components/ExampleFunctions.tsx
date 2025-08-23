import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../store/app-store';
import { marcoSoaresExamples } from '../lib/examples';

export function ExampleFunctions() {
  const { setFunction } = useAppStore();

  const handleLoadExample = (exampleFunc: any) => {
    setFunction(exampleFunc.func);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <i className="fas fa-book text-primary mr-2"></i>
          Examples (Marco G. Soares)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {marcoSoaresExamples.slice(0, 6).map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left p-3 h-auto justify-start"
            onClick={() => handleLoadExample(example)}
            data-testid={`button-example-${index}`}
          >
            <div>
              <div className="font-mono text-sm text-primary font-medium">
                {example.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {example.description}
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
