"use client";

import { useState } from "react";
import WorkspaceCrawler from "@/components/workspace-crawler";
import { DataBricksNotebook } from "@/components/DataBricksNotebook";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Code, 
  BarChart3, 
  Database, 
  Users, 
  Play,
  Save,
  Share2,
  ArrowLeft,
  Brain,
  Globe
} from "lucide-react";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("crawler");
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  const handleSaveNotebook = (notebook: any) => {
    console.log('Saving notebook:', notebook);
    // Integrate with your existing save functionality
    // This could connect to your crawler API or database
  };

  const handleLoadNotebook = async (notebookId: string) => {
    // Integrate with your existing data loading
    // This could fetch from your crawler results or database
    console.log('Loading notebook:', notebookId);
    return null;
  };

  const demoCollaborators = [
    {
      id: '1',
      name: 'Data Analyst',
      avatar: '/api/placeholder/32/32',
      isActive: true,
      cursor: { x: 150, y: 200 }
    },
    {
      id: '2',
      name: 'ML Engineer',
      avatar: '/api/placeholder/32/32',
      isActive: true,
      cursor: { x: 300, y: 150 }
    }
  ];

  if (isNotebookOpen) {
    return (
      <div className="h-screen">
        <div className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setIsNotebookOpen(false)}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Workspace
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-lg font-semibold text-white">Data Analysis Notebook</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        <DataBricksNotebook
          notebookId="crawler-analysis"
          collaborators={demoCollaborators}
          onSave={handleSaveNotebook}
          onLoad={handleLoadNotebook}
          readOnly={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Workspace</h1>
          <p className="text-gray-300">Advanced web crawling and data analysis environment</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="crawler" className="text-white data-[state=active]:bg-white/20">
              <Code className="h-4 w-4 mr-2" />
              Web Crawler
            </TabsTrigger>
            <TabsTrigger value="notebook" className="text-white data-[state=active]:bg-white/20">
              <FileText className="h-4 w-4 mr-2" />
              Data Notebook
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crawler" className="mt-6">
            <WorkspaceCrawler />
          </TabsContent>

          <TabsContent value="notebook" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-6 w-6" />
                    DataBricks Notebook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-12">
                    <div className="p-4 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Advanced Data Analysis</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Launch the DataBricks notebook to analyze your crawled data with Python, SQL, 
                      and visualization tools. Collaborate with your team in real-time.
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => setIsNotebookOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Launch Notebook
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-black border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg">
                            <Code className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-white">Data Analysis</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Analyze crawled data with Python, pandas, and statistical tools
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-black border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg">
                            <BarChart3 className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-white">Visualizations</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Create interactive charts and dashboards from your data
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-black border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg">
                            <Users className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-white">Collaboration</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Work together with your team in real-time
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}