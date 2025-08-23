import { QuadraticFunction, ComplexFunction, SimpleFunction } from './functions';
import { Complex } from './complex';

export interface ExampleFunction {
  name: string;
  description: string;
  func: ComplexFunction;
  category: string;
}

export const marcoSoaresExamples: ExampleFunction[] = [
  {
    name: "f(z) = z²",
    description: "Basic quadratic transformation",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), Complex.zero()),
    category: "Basic Transformations"
  },
  {
    name: "f(z) = z² + c",
    description: "Julia set transformation",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), new Complex(0.5, 0.3)),
    category: "Julia Sets"
  },
  {
    name: "f(z) = z² - 1",
    description: "Shifted quadratic",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), new Complex(-1, 0)),
    category: "Basic Transformations"
  },
  {
    name: "f(z) = z² + i",
    description: "Pure imaginary constant",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), Complex.i()),
    category: "Julia Sets"
  },
  {
    name: "f(z) = (z-1)(z+1)",
    description: "Two-root polynomial",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), new Complex(-1, 0)),
    category: "Factored Forms"
  },
  {
    name: "f(z) = 2z²",
    description: "Scaled quadratic",
    func: new QuadraticFunction(new Complex(2, 0), Complex.zero(), Complex.zero()),
    category: "Scaled Functions"
  },
  {
    name: "f(z) = z² + z",
    description: "Quadratic with linear term",
    func: new QuadraticFunction(Complex.one(), Complex.one(), Complex.zero()),
    category: "General Quadratics"
  },
  {
    name: "f(z) = iz²",
    description: "Rotated quadratic",
    func: new QuadraticFunction(Complex.i(), Complex.zero(), Complex.zero()),
    category: "Rotated Functions"
  },
  {
    name: "f(z) = z² + 0.3 + 0.5i",
    description: "Complex constant (bounded Julia set)",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), new Complex(0.3, 0.5)),
    category: "Julia Sets"
  },
  {
    name: "f(z) = z² - 0.7 + 0.27015i",
    description: "Spiral Julia set",
    func: new QuadraticFunction(Complex.one(), Complex.zero(), new Complex(-0.7, 0.27015)),
    category: "Julia Sets"
  }
];

export const additionalExamples: ExampleFunction[] = [
  {
    name: "f(z) = z",
    description: "Identity function",
    func: new SimpleFunction(
      (z: Complex) => z,
      (z: Complex) => Complex.one(),
      "Identity",
      "z"
    ),
    category: "Basic Functions"
  },
  {
    name: "f(z) = 1/z",
    description: "Inversion transformation",
    func: new SimpleFunction(
      (z: Complex) => Complex.one().divide(z),
      (z: Complex) => new Complex(-1, 0).divide(z.multiply(z)),
      "Inversion",
      "1/z"
    ),
    category: "Rational Functions"
  },
  {
    name: "f(z) = z³",
    description: "Cubic function",
    func: new SimpleFunction(
      (z: Complex) => z.multiply(z).multiply(z),
      (z: Complex) => new Complex(3, 0).multiply(z.multiply(z)),
      "Cubic",
      "z³"
    ),
    category: "Higher Polynomials"
  }
];

export function getAllExamples(): ExampleFunction[] {
  return [...marcoSoaresExamples, ...additionalExamples];
}

export function getExamplesByCategory(category: string): ExampleFunction[] {
  return getAllExamples().filter(ex => ex.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(getAllExamples().map(ex => ex.category));
  return Array.from(categories);
}
