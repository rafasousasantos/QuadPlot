import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAppStore } from '../store/app-store';

export function AnimationControls() {
  const { 
    animationSpeed, 
    setAnimationSpeed, 
    isAnimating, 
    setIsAnimating 
  } = useAppStore();

  const handlePlay = () => {
    setIsAnimating(true);
  };

  const handlePause = () => {
    setIsAnimating(false);
  };

  const handleStop = () => {
    setIsAnimating(false);
  };

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <i className="fas fa-play text-primary mr-2"></i>
          Animation Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handlePlay}
            disabled={isAnimating}
            className="bg-green-600 hover:bg-green-700"
            data-testid="button-play-animation"
          >
            <i className="fas fa-play mr-2"></i>Play
          </Button>
          <Button 
            onClick={handlePause}
            disabled={!isAnimating}
            variant="secondary"
            data-testid="button-pause-animation"
          >
            <i className="fas fa-pause mr-2"></i>Pause
          </Button>
          <Button 
            onClick={handleStop}
            variant="destructive"
            data-testid="button-stop-animation"
          >
            <i className="fas fa-stop mr-2"></i>Stop
          </Button>
          
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <Label className="text-muted-foreground">Speed</Label>
              <span className="text-muted-foreground font-mono" data-testid="text-animation-speed">
                {animationSpeed.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[animationSpeed]}
              onValueChange={handleSpeedChange}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
              data-testid="slider-animation-speed"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
