# Overview

This is a Complex Function Visualizer - an educational web application inspired by GeoGebra that specializes in visualizing complex quadratic functions. The application is designed as a mathematical learning tool based on "Cálculo em uma Variável Complexa" by Marco G. Soares, targeting university students and professors studying complex analysis.

The application provides interactive visualization of complex functions using domain coloring techniques, allowing users to see how complex transformations map the complex plane through color-coded representations. It includes predefined examples, real-time function editing, and both 2D domain coloring and 3D surface visualizations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built as a Single Page Application (SPA) using React with TypeScript, leveraging modern component patterns and state management. The architecture follows a modular component design with clear separation of concerns:

- **Component Structure**: Organized into specialized visualization components (DomainColoringCanvas, ThreeDVisualization), input components (FunctionInput, ParameterControls), and utility components
- **State Management**: Centralized using Zustand store for application state including current function, visualization bounds, coloring options, and animation controls
- **UI Framework**: Built on shadcn/ui components with Radix UI primitives for accessibility and Tailwind CSS for styling
- **Mathematical Engine**: Custom complex number arithmetic and function evaluation system with support for quadratic polynomials

## Backend Architecture

The server follows a minimal Express.js architecture designed for educational content delivery:

- **API Structure**: RESTful API with routes prefixed under `/api` for future extensibility
- **Data Storage**: Dual storage approach with in-memory storage for development and PostgreSQL schema defined for production
- **Database Schema**: Single table for saved functions with JSON parameters storage for flexibility
- **Development Tools**: Integrated Vite development server with hot module replacement and error overlay

## Core Visualization Engine

The mathematical visualization system implements domain coloring for complex function representation:

- **Domain Coloring Algorithm**: HSV color mapping where hue represents argument (angle) and brightness represents magnitude
- **Complex Arithmetic**: Full-featured Complex class with polar/rectangular conversion, arithmetic operations, and mathematical functions
- **Function System**: Extensible function interface supporting quadratic polynomials with plans for general polynomial and transcendental functions
- **Real-time Rendering**: Canvas-based rendering with configurable resolution and interactive mouse tracking

## Educational Features

The application includes educational tools specifically designed for complex analysis learning:

- **Example Library**: Curated examples from Marco G. Soares' textbook including Julia sets and basic transformations
- **Interactive Analysis**: Real-time function property display (roots, critical points, vertex calculation)
- **Animation System**: Parameter animation capabilities for dynamic mathematical exploration
- **Advanced Tools**: Planned Julia set analysis and Mandelbrot connection features

# External Dependencies

## Core Libraries
- **React Ecosystem**: React 18 with TypeScript, React Query for state management, Wouter for client-side routing
- **UI Components**: Radix UI primitives for accessibility, shadcn/ui component library, Tailwind CSS for styling
- **Mathematical Visualization**: Canvas API for 2D rendering, with preparation for Three.js or Plotly.js integration for 3D surfaces

## Database and Backend
- **Database**: PostgreSQL with Neon serverless driver (@neondatabase/serverless)
- **ORM**: Drizzle ORM with Zod schema validation for type-safe database operations
- **Server**: Express.js with session management via connect-pg-simple

## Development Infrastructure
- **Build Tools**: Vite for development and production builds with esbuild for server bundling
- **Development Experience**: TypeScript compilation, ESM modules, Replit integration plugins
- **Code Quality**: ESLint configuration, TypeScript strict mode, comprehensive type checking

## Planned Integrations
- **3D Visualization**: Three.js or Plotly.js for interactive 3D surface plots of complex function magnitudes
- **Mathematical Libraries**: Potential integration with math.js or similar for expanded function parsing
- **Export Capabilities**: Image and data export functionality for educational use