import { Complex } from './complex';
import { ComplexFunction } from './functions';

export interface ColoringOptions {
  saturation: number;
  brightness: number;
  contourLines: boolean;
  gridLines: boolean;
}

export function generateDomainColoring(
  func: ComplexFunction,
  width: number,
  height: number,
  bounds: { xMin: number, xMax: number, yMin: number, yMax: number },
  options: ColoringOptions = { saturation: 0.8, brightness: 1, contourLines: false, gridLines: false }
): ImageData {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Map pixel to complex number
      const real = bounds.xMin + (x / width) * (bounds.xMax - bounds.xMin);
      const imag = bounds.yMax - (y / height) * (bounds.yMax - bounds.yMin); // Flip Y axis
      const z = new Complex(real, imag);
      
      // Evaluate function
      const result = func.evaluate(z);
      
      // Handle infinite/undefined values
      if (!isFinite(result.real) || !isFinite(result.imag)) {
        const index = (y * width + x) * 4;
        imageData.data[index] = 0;     // R
        imageData.data[index + 1] = 0; // G
        imageData.data[index + 2] = 0; // B
        imageData.data[index + 3] = 255; // A
        continue;
      }
      
      // Convert to HSV for domain coloring
      const hue = (result.argument() + Math.PI) / (2 * Math.PI); // [0, 1]
      const magnitude = result.magnitude();
      
      // Apply brightness based on magnitude with logarithmic scaling
      let value = options.brightness;
      if (magnitude > 0) {
        // Use a smooth brightness function that highlights features
        const logMag = Math.log(1 + magnitude);
        value = options.brightness * (0.5 + 0.5 * Math.tanh(logMag - 1));
      }
      
      // Add contour lines for magnitude
      if (options.contourLines) {
        const contour = Math.abs(Math.sin(4 * Math.PI * Math.log(magnitude + 1)));
        if (contour > 0.9) value *= 0.3;
      }
      
      // Convert HSV to RGB
      const rgb = hsvToRgb(hue, options.saturation, value);
      
      // Set pixel
      const index = (y * width + x) * 4;
      imageData.data[index] = rgb.r;
      imageData.data[index + 1] = rgb.g;
      imageData.data[index + 2] = rgb.b;
      imageData.data[index + 3] = 255;
    }
  }
  
  return imageData;
}

function hsvToRgb(h: number, s: number, v: number): {r: number, g: number, b: number} {
  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 1/6) { r = c; g = x; b = 0; }
  else if (h < 2/6) { r = x; g = c; b = 0; }
  else if (h < 3/6) { r = 0; g = c; b = x; }
  else if (h < 4/6) { r = 0; g = x; b = c; }
  else if (h < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export function complexToScreenCoords(
  z: Complex,
  bounds: { xMin: number, xMax: number, yMin: number, yMax: number },
  width: number,
  height: number
): { x: number, y: number } {
  const x = ((z.real - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width;
  const y = ((bounds.yMax - z.imag) / (bounds.yMax - bounds.yMin)) * height;
  return { x, y };
}

export function screenToComplexCoords(
  screenX: number,
  screenY: number,
  bounds: { xMin: number, xMax: number, yMin: number, yMax: number },
  width: number,
  height: number
): Complex {
  const real = bounds.xMin + (screenX / width) * (bounds.xMax - bounds.xMin);
  const imag = bounds.yMax - (screenY / height) * (bounds.yMax - bounds.yMin);
  return new Complex(real, imag);
}
