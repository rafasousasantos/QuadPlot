import React, { useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/app-store';
import { generateDomainColoring, screenToComplexCoords } from '../lib/domain-coloring';

export function DomainColoringCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    currentFunction, 
    bounds, 
    resolution, 
    coloringOptions, 
    setMousePosition,
    mousePosition,
    functionValue,
    zoomIn,
    zoomOut,
    resetView,
    pan
  } = useAppStore();

  const [isDragging, setIsDragging] = React.useState(false);
  const [lastMousePos, setLastMousePos] = React.useState({ x: 0, y: 0 });

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Set canvas size
    canvas.width = resolution;
    canvas.height = resolution;

    // Generate domain coloring
    const imageData = generateDomainColoring(
      currentFunction,
      resolution,
      resolution,
      bounds,
      coloringOptions
    );

    // Draw to canvas
    ctx.putImageData(imageData, 0, 0);

    // Scale to fit display size
    ctx.imageSmoothingEnabled = true;
  }, [currentFunction, bounds, resolution, coloringOptions]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to complex coordinates
    const z = screenToComplexCoords(x, y, bounds, rect.width, rect.height);
    setMousePosition(z);

    // Handle dragging
    if (isDragging) {
      const deltaX = (x - lastMousePos.x) / rect.width;
      const deltaY = (y - lastMousePos.y) / rect.height;
      pan(-deltaX, deltaY); // Negative for natural drag direction
      setLastMousePos({ x, y });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setIsDragging(true);
    setLastMousePos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full border-0 cursor-move"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        data-testid="canvas-domain-coloring"
      />
      
      {/* Overlay controls */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="flex space-x-2">
          <button 
            onClick={zoomIn}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors" 
            title="Zoom In"
            data-testid="button-zoom-in"
          >
            <i className="fas fa-search-plus"></i>
          </button>
          <button 
            onClick={zoomOut}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors" 
            title="Zoom Out"
            data-testid="button-zoom-out"
          >
            <i className="fas fa-search-minus"></i>
          </button>
          <button 
            onClick={resetView}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors" 
            title="Reset View"
            data-testid="button-reset-view"
          >
            <i className="fas fa-home"></i>
          </button>
        </div>
      </div>
      
      {/* Color Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="text-xs font-medium text-foreground mb-2">Domain Coloring Legend</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Arg = 0°</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Arg = 120°</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Arg = 240°</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-black to-white rounded"></div>
            <span>|f(z)|</span>
          </div>
        </div>
      </div>

      {/* Coordinate Display */}
      {(mousePosition || functionValue) && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mouse Position:</span>
              <span className="font-mono ml-2" data-testid="text-mouse-position">
                {mousePosition ? `z = ${mousePosition.toString()}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Function Value:</span>
              <span className="font-mono ml-2" data-testid="text-function-value">
                {functionValue ? `f(z) = ${functionValue.toString()}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Magnitude:</span>
              <span className="font-mono ml-2" data-testid="text-magnitude">
                {functionValue ? `|f(z)| = ${functionValue.magnitude().toFixed(3)}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
