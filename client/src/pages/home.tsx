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

export default function Home() {
  const { selectedTab, setSelectedTab } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Complex Function Visualizer</h1>
                <p className="text-sm text-muted-foreground">Educational Mathematical Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2"
                data-testid="button-help"
              >
                <i className="fas fa-question-circle"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2"
                data-testid="button-settings"
              >
                <i className="fas fa-cog"></i>
              </Button>
              <Button 
                size="sm"
                data-testid="button-export"
              >
                <i className="fas fa-save mr-2"></i>Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <FunctionInput />
            <ParameterControls />
            <ExampleFunctions />
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visualization Tabs */}
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="border-b border-border px-6 py-4">
                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="domain-coloring" data-testid="tab-domain-coloring">
                      <i className="fas fa-palette mr-2"></i>Domain Coloring
                    </TabsTrigger>
                    <TabsTrigger value="3d-surface" data-testid="tab-3d-surface">
                      <i className="fas fa-cube mr-2"></i>3D Surface
                    </TabsTrigger>
                    <TabsTrigger value="split-view" data-testid="tab-split-view">
                      <i className="fas fa-chart-line mr-2"></i>Split View
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="domain-coloring" className="mt-0">
                      <DomainColoringCanvas />
                    </TabsContent>
                    
                    <TabsContent value="3d-surface" className="mt-0">
                      <div className="h-96">
                        <ThreeDVisualization />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="split-view" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                            <i className="fas fa-palette mr-2"></i>Domain Coloring
                          </h3>
                          <div className="h-80">
                            <DomainColoringCanvas />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                            <i className="fas fa-cube mr-2"></i>3D Surface
                          </h3>
                          <div className="h-80">
                            <ThreeDVisualization />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            <AnimationControls />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <FunctionProperties />
            {selectedTab !== 'split-view' && <ThreeDVisualization />}
            <AnalysisTools />
          </div>
        </div>
      </div>
    </div>
  );
}
