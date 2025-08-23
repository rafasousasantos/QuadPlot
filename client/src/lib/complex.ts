export class Complex {
  constructor(public real: number, public imag: number) {}

  static fromPolar(r: number, theta: number): Complex {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  static zero(): Complex {
    return new Complex(0, 0);
  }

  static one(): Complex {
    return new Complex(1, 0);
  }

  static i(): Complex {
    return new Complex(0, 1);
  }

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  subtract(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  divide(other: Complex): Complex {
    const denominator = other.real * other.real + other.imag * other.imag;
    if (Math.abs(denominator) < 1e-15) {
      return new Complex(Infinity, Infinity);
    }
    return new Complex(
      (this.real * other.real + this.imag * other.imag) / denominator,
      (this.imag * other.real - this.real * other.imag) / denominator
    );
  }

  power(exponent: number): Complex {
    const r = this.magnitude();
    const theta = this.argument();
    const newR = Math.pow(r, exponent);
    const newTheta = theta * exponent;
    return Complex.fromPolar(newR, newTheta);
  }

  sqrt(): Complex {
    const r = this.magnitude();
    const theta = this.argument();
    const newR = Math.sqrt(r);
    const newTheta = theta / 2;
    return Complex.fromPolar(newR, newTheta);
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  argument(): number {
    return Math.atan2(this.imag, this.real);
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  negate(): Complex {
    return new Complex(-this.real, -this.imag);
  }

  toString(): string {
    if (Math.abs(this.imag) < 1e-10) {
      return this.real.toFixed(3);
    }
    if (Math.abs(this.real) < 1e-10) {
      return `${this.imag.toFixed(3)}i`;
    }
    const sign = this.imag >= 0 ? '+' : '-';
    return `${this.real.toFixed(3)} ${sign} ${Math.abs(this.imag).toFixed(3)}i`;
  }

  equals(other: Complex, tolerance = 1e-10): boolean {
    return Math.abs(this.real - other.real) < tolerance && 
           Math.abs(this.imag - other.imag) < tolerance;
  }
}
