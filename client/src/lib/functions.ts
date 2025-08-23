import { Complex } from './complex';

export interface ComplexFunction {
  evaluate(z: Complex): Complex;
  derivative(z: Complex): Complex;
  name: string;
  expression: string;
}

export class QuadraticFunction implements ComplexFunction {
  name = "Quadratic Function";
  expression: string;

  constructor(
    private a: Complex,
    private b: Complex,
    private c: Complex
  ) {
    this.expression = `${this.formatCoeff(a)}z² + ${this.formatCoeff(b)}z + ${this.formatCoeff(c)}`;
  }

  private formatCoeff(coeff: Complex): string {
    if (coeff.equals(Complex.zero())) return "0";
    if (coeff.equals(Complex.one())) return "";
    return `(${coeff.toString()})`;
  }

  evaluate(z: Complex): Complex {
    // f(z) = az² + bz + c
    const z_squared = z.multiply(z);
    return this.a.multiply(z_squared)
      .add(this.b.multiply(z))
      .add(this.c);
  }

  derivative(z: Complex): Complex {
    // f'(z) = 2az + b
    return this.a.multiply(new Complex(2, 0)).multiply(z).add(this.b);
  }

  getRoots(): [Complex, Complex] {
    // Quadratic formula: z = (-b ± √(b² - 4ac)) / 2a
    const discriminant = this.b.multiply(this.b)
      .subtract(this.a.multiply(this.c).multiply(new Complex(4, 0)));
    
    const sqrt_discriminant = discriminant.sqrt();
    const two_a = this.a.multiply(new Complex(2, 0));
    
    const root1 = this.b.negate().add(sqrt_discriminant).divide(two_a);
    const root2 = this.b.negate().subtract(sqrt_discriminant).divide(two_a);
    
    return [root1, root2];
  }

  getVertex(): Complex {
    // Vertex: z = -b / 2a
    return this.b.negate().divide(this.a.multiply(new Complex(2, 0)));
  }

  getCriticalPoints(): Complex[] {
    // For quadratic, critical point is where f'(z) = 0
    // 2az + b = 0 => z = -b/(2a)
    return [this.getVertex()];
  }
}

export class SimpleFunction implements ComplexFunction {
  name: string;
  expression: string;

  constructor(
    private func: (z: Complex) => Complex,
    private derivFunc: (z: Complex) => Complex,
    name: string,
    expression: string
  ) {
    this.name = name;
    this.expression = expression;
  }

  evaluate(z: Complex): Complex {
    return this.func(z);
  }

  derivative(z: Complex): Complex {
    return this.derivFunc(z);
  }
}

export function parseFunction(expression: string): ComplexFunction {
  // Simple parser for basic expressions
  // This is a basic implementation - in production, you'd want a more robust parser
  
  const expr = expression.toLowerCase().replace(/\s/g, '');
  
  // Handle z^2
  if (expr === 'z^2' || expr === 'z²') {
    return new QuadraticFunction(Complex.one(), Complex.zero(), Complex.zero());
  }
  
  // Handle z^2 + c patterns
  const quadraticMatch = expr.match(/z\^?2?\s*\+\s*(.+)/);
  if (quadraticMatch) {
    const cValue = parseComplexNumber(quadraticMatch[1]);
    return new QuadraticFunction(Complex.one(), Complex.zero(), cValue);
  }
  
  // Default to z^2
  return new QuadraticFunction(Complex.one(), Complex.zero(), Complex.zero());
}

function parseComplexNumber(str: string): Complex {
  // Parse strings like "0.5+0.3i", "-1.2i", "2", etc.
  str = str.replace(/\s/g, '');
  
  if (str === 'i') return Complex.i();
  if (str === '-i') return new Complex(0, -1);
  
  // Handle pure real numbers
  if (!str.includes('i')) {
    return new Complex(parseFloat(str) || 0, 0);
  }
  
  // Handle pure imaginary numbers
  if (str.endsWith('i') && !str.includes('+') && !str.includes('-', 1)) {
    const imagPart = str.slice(0, -1);
    return new Complex(0, parseFloat(imagPart) || 1);
  }
  
  // Handle complex numbers with both real and imaginary parts
  const parts = str.split(/([+-])/);
  let real = 0, imag = 0;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '+' || part === '-') continue;
    
    if (part.includes('i')) {
      const imagStr = part.replace('i', '');
      imag = parseFloat(imagStr) || (part.startsWith('-') ? -1 : 1);
      if (i > 0 && parts[i-1] === '-') imag = -imag;
    } else {
      real = parseFloat(part) || 0;
      if (i > 0 && parts[i-1] === '-') real = -real;
    }
  }
  
  return new Complex(real, imag);
}
