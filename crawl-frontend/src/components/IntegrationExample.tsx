"use client";

import React, { useState } from 'react';
import { DataBricksNotebook } from './DataBricksNotebook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Code, 
  BarChart3, 
  Database, 
  Users, 
  Settings,
  Play,
  Save,
  Share2,
  Plus,
  Zap,
  Layers,
  Activity,
  ArrowLeft
} from 'lucide-react';

export const IntegrationExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const integrationFeatures = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Crawler Data Analysis",
      description: "Analyze scraped data directly in the notebook with Python, SQL, and visualization tools"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Data Visualization",
      description: "Create interactive charts and dashboards from your crawl results"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Pipeline Integration",
      description: "Connect to your crawler database and data storage systems"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work together with your team on data analysis and insights"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Processing",
      description: "Process and analyze data in real-time as it's being crawled"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "ML Model Training",
      description: "Train machine learning models on your crawled data"
    }
  ];

  if (isNotebookOpen) {
    return (
      <div className="h-screen">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setIsNotebookOpen(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">Data Analysis Notebook</h1>
            <Badge variant="outline">Connected to Crawler</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Crawler + DataBricks Integration</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamlessly integrate advanced data analysis capabilities with your web crawler.
            Analyze scraped data, create visualizations, and collaborate with your team.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              size="lg" 
              onClick={() => setIsNotebookOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Open Analysis Notebook
            </Button>
            <Button variant="outline" size="lg">
              <Code className="h-5 w-5 mr-2" />
              View Integration Code
            </Button>
          </div>
        </div>

        {/* Integration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Integration Features</CardTitle>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="api">API Integration</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrationFeatures.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {feature.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        </div>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Python Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded p-4">
                        <pre className="text-sm text-gray-800">{`# Analyze crawled data
import pandas as pd
import matplotlib.pyplot as plt

# Load data from crawler
df = pd.read_json('crawler_results.json')

# Analyze patterns
print(f"Total pages: {len(df)}")
print(f"Average load time: {df['load_time'].mean():.2f}s")

# Create visualization
plt.figure(figsize=(10, 6))
df['load_time'].hist(bins=20)
plt.title('Page Load Time Distribution')
plt.show()`}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        SQL Queries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded p-4">
                        <pre className="text-sm text-gray-800">{`-- Query crawled data
SELECT 
    domain,
    COUNT(*) as page_count,
    AVG(load_time) as avg_load_time,
    SUM(CASE WHEN status = 200 THEN 1 ELSE 0 END) as success_count
FROM crawled_pages 
WHERE crawled_at >= '2024-01-01'
GROUP BY domain
ORDER BY page_count DESC;`}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="collaboration" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            SC
                          </div>
                          <div>
                            <div className="font-medium">Sarah Chen</div>
                            <div className="text-sm text-gray-600">Analyzing user behavior patterns</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            MJ
                          </div>
                          <div>
                            <div className="font-medium">Mike Johnson</div>
                            <div className="text-sm text-gray-600">Building ML models for prediction</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Real-time Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">New crawl data available</span>
                          <Badge variant="secondary">2 min ago</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">Analysis completed</span>
                          <Badge variant="secondary">5 min ago</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">Model training started</span>
                          <Badge variant="secondary">10 min ago</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        API Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded p-4">
                        <pre className="text-sm text-gray-800">{`// Connect to crawler API
const crawlerAPI = {
  // Get crawl results
  getResults: async (crawlId) => {
    const response = await fetch(\`/api/crawler/\${crawlId}/results\`);
    return response.json();
  },
  
  // Start new crawl
  startCrawl: async (url, options) => {
    const response = await fetch('/api/crawler/start', {
      method: 'POST',
      body: JSON.stringify({ url, options })
    });
    return response.json();
  },
  
  // Get crawl status
  getStatus: async (crawlId) => {
    const response = await fetch(\`/api/crawler/\${crawlId}/status\`);
    return response.json();
  }
};`}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 rounded p-4">
                        <pre className="text-sm text-gray-800">{`// Notebook configuration
const notebookConfig = {
  // Connect to crawler data
  dataSources: {
    crawler: {
      type: 'api',
      endpoint: '/api/crawler',
      auth: 'bearer'
    },
    database: {
      type: 'postgres',
      connection: process.env.DATABASE_URL
    }
  },
  
  // Execution environment
  kernels: {
    python: {
      image: 'python:3.9',
      packages: ['pandas', 'numpy', 'matplotlib']
    },
    sql: {
      connection: 'postgresql://...'
    }
  }
};`}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        {/* Quick Start Guide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <h4 className="font-semibold">Start Crawling</h4>
                </div>
                <p className="text-gray-600">Use your existing crawler to collect data from websites</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <h4 className="font-semibold">Open Notebook</h4>
                </div>
                <p className="text-gray-600">Launch the DataBricks notebook to analyze your data</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                  <h4 className="font-semibold">Analyze & Visualize</h4>
                </div>
                <p className="text-gray-600">Create insights, charts, and ML models from your data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 