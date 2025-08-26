import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FunctionInput } from '../components/FunctionInput';
import { DomainColoringCanvas } from '../components/DomainColoringCanvas';
import { ParameterControls } from '../components/ParameterControls';
import { FunctionProperties } from '../components/FunctionProperties';
import { ThreeDVisualization } from '../components/ThreeDVisualization';
import { ExampleFunctions } from '../components/ExampleFunctions';
import { AnimationControls } from '../components/AnimationControls';
import { AnalysisTools } from '../components/AnalysisTools';
import { useAppStore } from '../store/app-store';
import { QuadraticFunction } from '../lib/functions';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  const { selectedTab, setSelectedTab, currentFunction, bounds } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-infinity text-primary-foreground text-xl"></i>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-warning rounded-full border-2 border-card"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Complex Function Visualizer
                </h1>
                <p className="text-sm text-muted-foreground flex items-center">
                  <i className="fas fa-graduation-cap mr-1 text-xs"></i>
                  Educational Mathematical Tool
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="interactive-button hidden md:flex"
                data-testid="button-help"
              >
                <i className="fas fa-question-circle mr-2"></i>
                Help
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="interactive-button p-2 md:hidden"
                data-testid="button-help-mobile"
              >
                <i className="fas fa-question-circle"></i>
              </Button>
              
              <ThemeToggle />
              
              <Button 
                variant="outline" 
                size="sm"
                className="interactive-button"
                data-testid="button-settings"
              >
                <i className="fas fa-cog mr-2"></i>
                <span className="hidden md:inline">Settings</span>
              </Button>
              
              <Button 
                size="sm"
                className="interactive-button bg-gradient-to-r from-primary to-primary-dark"
                data-testid="button-export"
              >
                <i className="fas fa-download mr-2"></i>
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Enhanced Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <div className="visualization-container animate-in">
                <div className="border-b border-border px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent">
                  <h3 className="font-semibold text-foreground flex items-center">
                    <i className="fas fa-function mr-2 text-primary"></i>
                    Function Input
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Define your complex function</p>
                </div>
                <div className="p-4">
                  <FunctionInput />
                </div>
              </div>

              <div className="visualization-container animate-in">
                <div className="border-b border-border px-4 py-3 bg-gradient-to-r from-warning/5 to-transparent">
                  <h3 className="font-semibold text-foreground flex items-center">
                    <i className="fas fa-sliders-h mr-2 text-warning"></i>
                    Parameters
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Adjust visualization settings</p>
                </div>
                <div className="p-4">
                  <ParameterControls />
                </div>
              </div>


            </div>
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Enhanced Visualization Container */}
            <div className="visualization-container animate-in">
              <div className="border-b border-border px-6 py-4 bg-gradient-to-r from-muted/20 to-transparent">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Mathematical Visualization</h2>
                    <p className="text-sm text-muted-foreground">Interactive complex function analysis</p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                      Live Rendering
                    </div>
                  </div>
                </div>
                
                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                    <TabsTrigger 
                      value="domain-coloring" 
                      data-testid="tab-domain-coloring"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                    >
                      <i className="fas fa-palette mr-2"></i>
                      <span className="hidden sm:inline">Domain Coloring</span>
                      <span className="sm:hidden">Colors</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="3d-surface" 
                      data-testid="tab-3d-surface"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                    >
                      <i className="fas fa-cube mr-2"></i>
                      <span className="hidden sm:inline">3D Surface</span>
                      <span className="sm:hidden">3D</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="split-view" 
                      data-testid="tab-split-view"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                    >
                      <i className="fas fa-grip-vertical mr-2"></i>
                      <span className="hidden sm:inline">Split View</span>
                      <span className="sm:hidden">Split</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6 bg-gradient-to-br from-background to-muted/20">
                    <TabsContent value="domain-coloring" className="mt-0 animate-fade-in">
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-muted-foreground border">
                            Real-time Domain Coloring
                          </div>
                        </div>
                        <DomainColoringCanvas />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="3d-surface" className="mt-0 animate-fade-in">
                      <div className="h-[600px] relative">
                        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-muted-foreground border">
                            3D Surface Visualization
                          </div>
                        </div>
                        <ThreeDVisualization />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="split-view" className="mt-0 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                        
                        {/* Domain Coloring Panel */}
                        <div className="visualization-container overflow-hidden">
                          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b border-border/50">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-foreground flex items-center">
                                <div className="w-3 h-3 bg-primary rounded-full mr-2 animate-pulse"></div>
                                <i className="fas fa-palette mr-2 text-primary"></i>
                                Domain Coloring
                              </h3>
                              <div className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                                Real-time
                              </div>
                            </div>
                          </div>
                          <div className="h-[calc(100%-48px)] relative">
                            <DomainColoringCanvas />
                          </div>
                        </div>

                        {/* 3D Surface Panel */}
                        <div className="visualization-container overflow-hidden">
                          <div className="bg-gradient-to-r from-success/10 to-success/5 px-4 py-3 border-b border-border/50">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-foreground flex items-center">
                                <div className="w-3 h-3 bg-success rounded-full mr-2 animate-pulse"></div>
                                <i className="fas fa-cube mr-2 text-success"></i>
                                3D Surface
                              </h3>
                              <div className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                                Interactive
                              </div>
                            </div>
                          </div>
                          <div className="h-[calc(100%-48px)] relative min-h-[350px]">
                            <ThreeDVisualization />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Example Functions */}
            <div className="visualization-container animate-in">
              <div className="border-b border-border px-4 py-3 bg-gradient-to-r from-success/5 to-transparent">
                <h3 className="font-semibold text-foreground flex items-center">
                  <i className="fas fa-lightbulb mr-2 text-success"></i>
                  Examples
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Predefined mathematical functions</p>
              </div>
              <div className="p-4">
                <ExampleFunctions />
              </div>
            </div>


          </div>

          {/* Enhanced Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <div className="visualization-container animate-in">
                <div className="border-b border-border px-4 py-3 bg-gradient-to-r from-accent-foreground/5 to-transparent">
                  <h3 className="font-semibold text-foreground flex items-center">
                    <i className="fas fa-info-circle mr-2 text-accent-foreground"></i>
                    Function Properties
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Mathematical analysis</p>
                </div>
                <div className="p-4">
                  <FunctionProperties />
                </div>
              </div>



              <div className="visualization-container animate-in">
                <div className="border-b border-border px-4 py-3 bg-gradient-to-r from-chart-5/20 to-transparent">
                  <h3 className="font-semibold text-foreground flex items-center">
                    <i className="fas fa-calculator mr-2 text-chart-5"></i>
                    Analysis Tools
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Advanced mathematical tools</p>
                </div>
                <div className="p-4">
                  <AnalysisTools />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
