"use client";

import React, { useState } from 'react';
import { DataBricksNotebook } from './DataBricksNotebook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Type, 
  BarChart3, 
  Database, 
  Users, 
  Settings, 
  Play,
  Save,
  Share2,
  Plus,
  FileText,
  Zap,
  Layers,
  Activity
} from 'lucide-react';

export const DataBricksDemo: React.FC = () => {
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  const handleSaveNotebook = (notebook: any) => {
    console.log('Saving notebook:', notebook);
    // Here you would typically save to your backend
  };

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Multi-Language Support",
      description: "Python, Scala, SQL, R, and more with syntax highlighting and autocomplete"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "See live cursors, edit together, and share notebooks with your team"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Rich Visualizations",
      description: "Interactive charts, graphs, and dashboards with matplotlib, plotly, and more"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Integration",
      description: "Connect to databases, data lakes, and streaming sources seamlessly"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Auto-scaling Clusters",
      description: "Automatic resource management and cluster scaling for optimal performance"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "ML Pipeline Integration",
      description: "Built-in support for MLflow, model training, and deployment workflows"
    }
  ];

  const cellTypes = [
    {
      type: 'code',
      icon: <Code className="h-4 w-4" />,
      name: 'Code Cell',
      description: 'Execute Python, Scala, R, or SQL code',
      example: 'import pandas as pd\n\ndf = pd.read_csv("data.csv")\nprint(df.head())'
    },
    {
      type: 'markdown',
      icon: <Type className="h-4 w-4" />,
      name: 'Markdown Cell',
      description: 'Documentation, explanations, and rich text',
      example: '# Analysis Results\n\nThis notebook demonstrates...\n\n## Key Findings\n- Finding 1\n- Finding 2'
    },
    {
      type: 'visualization',
      icon: <BarChart3 className="h-4 w-4" />,
      name: 'Visualization Cell',
      description: 'Charts, graphs, and interactive plots',
      example: 'plt.figure(figsize=(10, 6))\nplt.plot(x, y)\nplt.title("Sales Trend")\nplt.show()'
    },
    {
      type: 'sql',
      icon: <Database className="h-4 w-4" />,
      name: 'SQL Cell',
      description: 'Database queries and data manipulation',
      example: 'SELECT region, SUM(sales) as total_sales\nFROM sales_data\nGROUP BY region\nORDER BY total_sales DESC'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {!isNotebookOpen ? (
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">DataBricks Notebook</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced collaborative notebook environment for data science, machine learning, and analytics.
              Built with React, TypeScript, and modern UI components.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button 
                size="lg" 
                onClick={() => setIsNotebookOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-5 w-5 mr-2" />
                Launch Notebook
              </Button>
              <Button variant="outline" size="lg">
                <Code className="h-5 w-5 mr-2" />
                View Source
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
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

          {/* Cell Types */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Supported Cell Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cellTypes.map((cellType, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {cellType.icon}
                      <h4 className="font-semibold text-gray-900">{cellType.name}</h4>
                    </div>
                    <p className="text-gray-600 mb-3">{cellType.description}</p>
                    <div className="bg-gray-100 rounded p-3">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">{cellType.example}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Tabs defaultValue="basic" className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Usage Examples</CardTitle>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Notebook Setup</h4>
                    <div className="bg-gray-100 rounded p-4">
                      <pre className="text-sm">{`import { DataBricksNotebook } from './components/DataBricksNotebook';

function App() {
  return (
    <DataBricksNotebook
      notebookId="demo-notebook"
      onSave={(notebook) => console.log('Saving:', notebook)}
      onLoad={(id) => fetch(\`/api/notebooks/\${id}\`)}
    />
  );
}`}</pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Collaborative Features</h4>
                    <div className="bg-gray-100 rounded p-4">
                      <pre className="text-sm">{`const collaborators = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    isActive: true,
    cursor: { x: 150, y: 200 }
  }
];

<DataBricksNotebook
  collaborators={collaborators}
  readOnly={false}
/>`}</pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="integration" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Backend Integration</h4>
                    <div className="bg-gray-100 rounded p-4">
                      <pre className="text-sm">{`// API endpoints for notebook operations
const notebookAPI = {
  save: async (notebook) => {
    return fetch('/api/notebooks', {
      method: 'POST',
      body: JSON.stringify(notebook)
    });
  },
  
  execute: async (cellId, code) => {
    return fetch('/api/execute', {
      method: 'POST',
      body: JSON.stringify({ cellId, code })
    });
  }
};`}</pre>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Built With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion',
                  'Lucide Icons', 'Radix UI', 'Next.js', 'shadcn/ui'
                ].map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <DataBricksNotebook
          notebookId="demo-notebook"
          onSave={handleSaveNotebook}
          readOnly={false}
        />
      )}
    </div>
  );
}; 