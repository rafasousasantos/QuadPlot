import { create } from 'zustand';
import { ComplexFunction, QuadraticFunction } from '../lib/functions';
import { Complex } from '../lib/complex';
import { ColoringOptions } from '../lib/domain-coloring';

export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface VisualizationState {
  currentFunction: ComplexFunction;
  bounds: Bounds;
  resolution: number;
  coloringOptions: ColoringOptions;
  showGrid: boolean;
  animationSpeed: number;
  isAnimating: boolean;
  mousePosition: Complex | null;
  functionValue: Complex | null;
  selectedTab: 'domain-coloring' | '3d-surface' | 'split-view';
}

interface AppStore extends VisualizationState {
  // Actions
  setFunction: (func: ComplexFunction) => void;
  setBounds: (bounds: Bounds) => void;
  setResolution: (resolution: number) => void;
  setColoringOptions: (options: Partial<ColoringOptions>) => void;
  setShowGrid: (show: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
  animationSpeed: number;
  setIsAnimating: (animating: boolean) => void;
  setMousePosition: (position: Complex | null) => void;
  setSelectedTab: (tab: 'domain-coloring' | '3d-surface' | 'split-view') => void;
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  pan: (deltaX: number, deltaY: number) => void;
}

const defaultBounds: Bounds = {
  xMin: -2,
  xMax: 2,
  yMin: -2,
  yMax: 2
};

const defaultColoringOptions: ColoringOptions = {
  saturation: 0.8,
  brightness: 1,
  contourLines: false,
  gridLines: false
};

export const useAppStore = create<AppStore>()((set, get) => ({
  // Initial state
  currentFunction: new QuadraticFunction(Complex.one(), Complex.zero(), new Complex(0.5, 0.3)),
  bounds: defaultBounds,
  resolution: 500,
  coloringOptions: defaultColoringOptions,
  showGrid: false,
  animationSpeed: 1.0,
  isAnimating: false,
  mousePosition: null,
  functionValue: null,
  selectedTab: 'domain-coloring',

  // Actions
  setFunction: (func: ComplexFunction) => {
    set({ currentFunction: func });
    // Update function value if mouse position exists
    const { mousePosition } = get();
    if (mousePosition) {
      const value = func.evaluate(mousePosition);
      set({ functionValue: value });
    }
  },

  setBounds: (bounds: Bounds) => set({ bounds }),

  setResolution: (resolution: number) => set({ resolution }),

  setColoringOptions: (options: Partial<ColoringOptions>) => {
    const current = get().coloringOptions;
    set({ coloringOptions: { ...current, ...options } });
  },

  setShowGrid: (show: boolean) => set({ showGrid: show }),

  setAnimationSpeed: (speed: number) => set({ animationSpeed: speed }),

  setIsAnimating: (animating: boolean) => set({ isAnimating: animating }),

  setMousePosition: (position: Complex | null) => {
    set({ mousePosition: position });
    if (position) {
      const { currentFunction } = get();
      const value = currentFunction.evaluate(position);
      set({ functionValue: value });
    } else {
      set({ functionValue: null });
    }
  },

  setSelectedTab: (tab: 'domain-coloring' | '3d-surface' | 'split-view') => 
    set({ selectedTab: tab }),

  resetView: () => set({ bounds: defaultBounds }),

  zoomIn: () => {
    const { bounds } = get();
    const centerX = (bounds.xMin + bounds.xMax) / 2;
    const centerY = (bounds.yMin + bounds.yMax) / 2;
    const rangeX = (bounds.xMax - bounds.xMin) * 0.8;
    const rangeY = (bounds.yMax - bounds.yMin) * 0.8;
    
    set({
      bounds: {
        xMin: centerX - rangeX / 2,
        xMax: centerX + rangeX / 2,
        yMin: centerY - rangeY / 2,
        yMax: centerY + rangeY / 2
      }
    });
  },

  zoomOut: () => {
    const { bounds } = get();
    const centerX = (bounds.xMin + bounds.xMax) / 2;
    const centerY = (bounds.yMin + bounds.yMax) / 2;
    const rangeX = (bounds.xMax - bounds.xMin) * 1.25;
    const rangeY = (bounds.yMax - bounds.yMin) * 1.25;
    
    set({
      bounds: {
        xMin: centerX - rangeX / 2,
        xMax: centerX + rangeX / 2,
        yMin: centerY - rangeY / 2,
        yMax: centerY + rangeY / 2
      }
    });
  },

  pan: (deltaX: number, deltaY: number) => {
    const { bounds } = get();
    const rangeX = bounds.xMax - bounds.xMin;
    const rangeY = bounds.yMax - bounds.yMin;
    
    set({
      bounds: {
        xMin: bounds.xMin + deltaX * rangeX,
        xMax: bounds.xMax + deltaX * rangeX,
        yMin: bounds.yMin + deltaY * rangeY,
        yMax: bounds.yMax + deltaY * rangeY
      }
    });
  }
}));
