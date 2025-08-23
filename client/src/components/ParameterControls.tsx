import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '../store/app-store';

export function ParameterControls() {
  const { 
    bounds, 
    setBounds, 
    resolution, 
    setResolution, 
    coloringOptions, 
    setColoringOptions,
    showGrid,
    setShowGrid
  } = useAppStore();

  const handleDomainRangeChange = (value: number[]) => {
    const range = value[0];
    setBounds({
      xMin: -range,
      xMax: range,
      yMin: -range,
      yMax: range
    });
  };

  const handleResolutionChange = (value: number[]) => {
    setResolution(value[0]);
  };

  const handleSaturationChange = (value: number[]) => {
    setColoringOptions({ saturation: value[0] / 100 });
  };

  const handleBrightnessChange = (value: number[]) => {
    setColoringOptions({ brightness: value[0] / 100 });
  };

  const domainRange = Math.max(Math.abs(bounds.xMin), Math.abs(bounds.xMax));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <i className="fas fa-sliders-h text-primary mr-2"></i>
          Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <Label className="font-medium">Domain Range</Label>
            <span className="text-muted-foreground font-mono" data-testid="text-domain-range">
              [{-domainRange.toFixed(1)}, {domainRange.toFixed(1)}]
            </span>
          </div>
          <Slider
            value={[domainRange]}
            onValueChange={handleDomainRangeChange}
            min={1}
            max={5}
            step={0.1}
            className="w-full"
            data-testid="slider-domain-range"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <Label className="font-medium">Resolution</Label>
            <span className="text-muted-foreground font-mono" data-testid="text-resolution">
              {resolution}x{resolution}
            </span>
          </div>
          <Slider
            value={[resolution]}
            onValueChange={handleResolutionChange}
            min={100}
            max={1000}
            step={50}
            className="w-full"
            data-testid="slider-resolution"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <Label className="font-medium">Saturation</Label>
            <span className="text-muted-foreground font-mono" data-testid="text-saturation">
              {Math.round(coloringOptions.saturation * 100)}%
            </span>
          </div>
          <Slider
            value={[coloringOptions.saturation * 100]}
            onValueChange={handleSaturationChange}
            min={0}
            max={100}
            step={1}
            className="w-full"
            data-testid="slider-saturation"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <Label className="font-medium">Brightness</Label>
            <span className="text-muted-foreground font-mono" data-testid="text-brightness">
              {Math.round(coloringOptions.brightness * 100)}%
            </span>
          </div>
          <Slider
            value={[coloringOptions.brightness * 100]}
            onValueChange={handleBrightnessChange}
            min={10}
            max={200}
            step={5}
            className="w-full"
            data-testid="slider-brightness"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="contour-lines"
            checked={coloringOptions.contourLines}
            onCheckedChange={(checked) => setColoringOptions({ contourLines: checked })}
            data-testid="switch-contour-lines"
          />
          <Label htmlFor="contour-lines" className="text-sm">Contour Lines</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="grid-lines"
            checked={showGrid}
            onCheckedChange={setShowGrid}
            data-testid="switch-grid"
          />
          <Label htmlFor="grid-lines" className="text-sm">Grid Lines</Label>
        </div>
      </CardContent>
    </Card>
  );
}
