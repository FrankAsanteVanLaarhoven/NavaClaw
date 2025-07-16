"use client";

import { useState } from "react";
import { DataBricksNotebook, IntegrationExample } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Brain,
  Globe
} from "lucide-react";

export default function NotebookPage() {
  const [activeTab, setActiveTab] = useState("notebook");
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
        <div className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setIsNotebookOpen(false)}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-lg font-semibold text-white">Data Analysis Notebook</h1>
            <Badge variant="outline" className="text-white border-white/20">Connected to Crawler</Badge>
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">DataBricks Notebook</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced collaborative notebook environment for data science, machine learning, and analytics.
            Seamlessly integrated with your web crawler for powerful data analysis.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              size="lg" 
              onClick={() => setIsNotebookOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Launch Notebook
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
              <Code className="h-5 w-5 mr-2" />
              View Examples
            </Button>
          </div>
        </div>

        {/* Integration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Notebook Features</CardTitle>
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger value="notebook" className="text-white data-[state=active]:bg-white/20">Notebook</TabsTrigger>
                <TabsTrigger value="integration" className="text-white data-[state=active]:bg-white/20">Integration</TabsTrigger>
                <TabsTrigger value="examples" className="text-white data-[state=active]:bg-white/20">Examples</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="notebook" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrationFeatures.map((feature, index) => (
                    <Card key={index} className="bg-black border-white/10 hover:border-white/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg">
                            {feature.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                        </div>
                        <p className="text-gray-300">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="integration" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Code className="h-5 w-5" />
                        Python Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/5 rounded p-4">
                        <pre className="text-sm text-gray-300">{`# Analyze crawled data
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

                  <Card className="bg-black border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Database className="h-5 w-5" />
                        SQL Queries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/5 rounded p-4">
                        <pre className="text-sm text-gray-300">{`-- Query crawled data
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

              <TabsContent value="examples" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Brain className="h-5 w-5" />
                        Machine Learning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/5 rounded p-4">
                        <pre className="text-sm text-gray-300">{`# Train ML model on crawled data
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Prepare features
X = df[['load_time', 'content_length', 'status']]
y = df['is_successful']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Model accuracy: {accuracy:.2f}")`}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Globe className="h-5 w-5" />
                        Web Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/5 rounded p-4">
                        <pre className="text-sm text-gray-300">{`# Web analytics dashboard
import plotly.express as px
import plotly.graph_objects as go

# Create interactive dashboard
fig = go.Figure()

# Add traces
fig.add_trace(go.Scatter(
    x=df['timestamp'],
    y=df['load_time'],
    mode='lines+markers',
    name='Load Times'
))

fig.update_layout(
    title='Website Performance Over Time',
    xaxis_title='Time',
    yaxis_title='Load Time (seconds)'
)

fig.show()`}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        {/* Quick Start Guide */}
        <Card className="mb-12 bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <h4 className="font-semibold text-white">Start Crawling</h4>
                </div>
                <p className="text-gray-300">Use your existing crawler to collect data from websites</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <h4 className="font-semibold text-white">Open Notebook</h4>
                </div>
                <p className="text-gray-300">Launch the DataBricks notebook to analyze your data</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                  <h4 className="font-semibold text-white">Analyze & Visualize</h4>
                </div>
                <p className="text-gray-300">Create insights, charts, and ML models from your data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 