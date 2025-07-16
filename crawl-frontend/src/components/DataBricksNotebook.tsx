"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Plus, 
  Save, 
  FolderOpen, 
  Terminal, 
  FileText, 
  BarChart3, 
  Database, 
  Users, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Code, 
  Type, 
  Sun, 
  Moon, 
  Search,
  Clock,
  Folder,
  File,
  Circle,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Download,
  Upload,
  Share2,
  GitBranch,
  Layers,
  Activity,
  Zap,
  PauseCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface User {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  cursor?: { x: number; y: number };
}

interface NotebookCell {
  id: string;
  type: 'code' | 'markdown' | 'visualization' | 'sql';
  content: string;
  output?: any;
  isExecuting?: boolean;
  executionTime?: number;
  error?: string;
  isVisible?: boolean;
  collaborators?: string[];
}

interface NotebookFile {
  id: string;
  name: string;
  path: string;
  lastModified: Date;
  size: string;
  type: 'notebook' | 'folder';
  children?: NotebookFile[];
}

interface KernelInfo {
  id: string;
  name: string;
  language: string;
  status: 'idle' | 'busy' | 'dead';
  lastActivity: Date;
}

interface DataBricksNotebookProps {
  notebookId?: string;
  collaborators?: User[];
  onSave?: (notebook: any) => void;
  onLoad?: (notebookId: string) => Promise<any>;
  readOnly?: boolean;
}

const demoFiles: NotebookFile[] = [
  {
    id: '1',
    name: 'Data Analysis',
    path: '/Workspace/Data Analysis',
    lastModified: new Date('2024-01-15'),
    size: '2.3 MB',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'Customer Segmentation.ipynb',
        path: '/Workspace/Data Analysis/Customer Segmentation.ipynb',
        lastModified: new Date('2024-01-15'),
        size: '1.2 MB',
        type: 'notebook'
      },
      {
        id: '3',
        name: 'Sales Dashboard.ipynb',
        path: '/Workspace/Data Analysis/Sales Dashboard.ipynb',
        lastModified: new Date('2024-01-14'),
        size: '0.8 MB',
        type: 'notebook'
      }
    ]
  },
  {
    id: '4',
    name: 'ML Models',
    path: '/Workspace/ML Models',
    lastModified: new Date('2024-01-13'),
    size: '5.1 MB',
    type: 'folder',
    children: [
      {
        id: '5',
        name: 'Fraud Detection.ipynb',
        path: '/Workspace/ML Models/Fraud Detection.ipynb',
        lastModified: new Date('2024-01-13'),
        size: '3.2 MB',
        type: 'notebook'
      }
    ]
  },
  {
    id: '6',
    name: 'ETL Pipeline.ipynb',
    path: '/Workspace/ETL Pipeline.ipynb',
    lastModified: new Date('2024-01-12'),
    size: '1.5 MB',
    type: 'notebook'
  }
];

const demoKernels: KernelInfo[] = [
  {
    id: 'python-1',
    name: 'Python 3.9',
    language: 'python',
    status: 'idle',
    lastActivity: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'scala-1',
    name: 'Scala 2.12',
    language: 'scala',
    status: 'busy',
    lastActivity: new Date('2024-01-15T11:45:00')
  },
  {
    id: 'sql-1',
    name: 'SQL',
    language: 'sql',
    status: 'idle',
    lastActivity: new Date('2024-01-15T09:15:00')
  }
];

const demoRunHistory = [
  {
    id: '1',
    cellId: 'cell-1',
    timestamp: new Date('2024-01-15T11:45:00'),
    duration: 2.3,
    status: 'success'
  },
  {
    id: '2',
    cellId: 'cell-2',
    timestamp: new Date('2024-01-15T11:42:00'),
    duration: 0.8,
    status: 'success'
  },
  {
    id: '3',
    cellId: 'cell-1',
    timestamp: new Date('2024-01-15T11:40:00'),
    duration: 1.2,
    status: 'error'
  }
];

const demoCollaborators: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/api/placeholder/32/32',
    isActive: true,
    cursor: { x: 150, y: 200 }
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: '/api/placeholder/32/32',
    isActive: true,
    cursor: { x: 300, y: 150 }
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: '/api/placeholder/32/32',
    isActive: false
  }
];

export const DataBricksNotebook: React.FC<DataBricksNotebookProps> = ({
  notebookId,
  collaborators = demoCollaborators,
  onSave,
  onLoad,
  readOnly = false
}) => {
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: 'cell-1',
      type: 'code',
      content: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load sample data
df = pd.read_csv('sales_data.csv')
print(f"Dataset shape: {df.shape}")
df.head()`,
      output: {
        text: "Dataset shape: (1000, 5)\n   date    product  sales  region  customer_id\n0  2024-01-01  A    1200  North          1\n1  2024-01-02  B     800  South          2\n2  2024-01-03  A    1500  East           3"
      },
      executionTime: 2.3,
      isVisible: true,
      collaborators: ['1']
    },
    {
      id: 'cell-2',
      type: 'markdown',
      content: `# Sales Analysis Dashboard

This notebook demonstrates a comprehensive sales analysis using Python and Databricks.

## Key Metrics
- Total Revenue: $2.4M
- Growth Rate: 15.2%
- Customer Acquisition: 234 new customers

## Methodology
We use a combination of statistical analysis and machine learning to identify trends and patterns in the sales data.`,
      isVisible: true
    },
    {
      id: 'cell-3',
      type: 'visualization',
      content: `# Sales trend visualization
sales_by_month = df.groupby('month')['sales'].sum()
plt.figure(figsize=(12, 6))
plt.plot(sales_by_month.index, sales_by_month.values, marker='o')
plt.title('Monthly Sales Trend')
plt.xlabel('Month')
plt.ylabel('Sales ($)')
plt.grid(True)
plt.show()`,
      output: {
        type: 'chart',
        data: 'Monthly sales chart visualization would appear here'
      },
      executionTime: 1.8,
      isVisible: true,
      collaborators: ['2']
    },
    {
      id: 'cell-4',
      type: 'sql',
      content: `SELECT 
    region,
    SUM(sales) as total_sales,
    COUNT(*) as transaction_count,
    AVG(sales) as avg_sales
FROM sales_data 
WHERE date >= '2024-01-01'
GROUP BY region
ORDER BY total_sales DESC`,
      output: {
        type: 'table',
        data: [
          { region: 'North', total_sales: 450000, transaction_count: 120, avg_sales: 3750 },
          { region: 'South', total_sales: 380000, transaction_count: 95, avg_sales: 4000 },
          { region: 'East', total_sales: 320000, transaction_count: 85, avg_sales: 3765 }
        ]
      },
      executionTime: 0.9,
      isVisible: true
    }
  ]);

  const [selectedKernel, setSelectedKernel] = useState<string>('python-1');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('files');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '4']));
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [variables, setVariables] = useState([
    { name: 'df', type: 'DataFrame', value: '1000 rows × 5 columns' },
    { name: 'sales_by_month', type: 'Series', value: '12 elements' },
    { name: 'total_revenue', type: 'float', value: '2400000.0' }
  ]);

  const notebookRef = useRef<HTMLDivElement>(null);
  const draggedCell = useRef<string | null>(null);

  const handleCellExecution = async (cellId: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, isExecuting: true, error: undefined }
        : cell
    ));

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    setCells(prev => prev.map(cell => 
      cell.id === cellId 
        ? { 
            ...cell, 
            isExecuting: false, 
            executionTime: Math.random() * 3 + 0.5,
            output: cell.output || { text: 'Execution completed successfully' }
          }
        : cell
    ));
  };

  const handleAddCell = (type: NotebookCell['type'], afterCellId?: string) => {
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}`,
      type,
      content: '',
      isVisible: true
    };

    setCells(prev => {
      if (!afterCellId) {
        return [...prev, newCell];
      }
      
      const index = prev.findIndex(cell => cell.id === afterCellId);
      const newCells = [...prev];
      newCells.splice(index + 1, 0, newCell);
      return newCells;
    });
  };

  const handleDeleteCell = (cellId: string) => {
    setCells(prev => prev.filter(cell => cell.id !== cellId));
  };

  const handleCellContentChange = (cellId: string, content: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, content } : cell
    ));
  };

  const handleDragStart = (cellId: string) => {
    draggedCell.current = cellId;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCellId: string) => {
    e.preventDefault();
    
    if (!draggedCell.current || draggedCell.current === targetCellId) return;

    setCells(prev => {
      const draggedIndex = prev.findIndex(cell => cell.id === draggedCell.current);
      const targetIndex = prev.findIndex(cell => cell.id === targetCellId);
      
      const newCells = [...prev];
      const draggedCellData = newCells.splice(draggedIndex, 1)[0];
      newCells.splice(targetIndex, 0, draggedCellData);
      
      return newCells;
    });

    draggedCell.current = null;
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      onSave?.({
        id: notebookId,
        cells,
        metadata: {
          kernel: selectedKernel,
          lastModified: new Date(),
          collaborators: collaborators.map(c => c.id)
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderFileTree = (files: NotebookFile[], depth = 0) => {
    return files.map(file => (
      <div key={file.id} className="w-full">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors ${
            depth > 0 ? 'ml-4' : ''
          }`}
        >
          {file.type === 'folder' && (
            <button
              onClick={() => toggleFolder(file.id)}
              className="p-0.5 hover:bg-white/20 rounded"
            >
              {expandedFolders.has(file.id) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {file.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-400" />
          ) : (
            <File className="h-4 w-4 text-white/70" />
          )}
          <span className="text-sm text-white/90 flex-1 truncate">
            {file.name}
          </span>
        </div>
        {file.type === 'folder' && expandedFolders.has(file.id) && file.children && (
          <div className="ml-2">
            {renderFileTree(file.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderCell = (cell: NotebookCell) => {
    const cellIcon = {
      code: <Code className="h-4 w-4" />,
      markdown: <Type className="h-4 w-4" />,
      visualization: <BarChart3 className="h-4 w-4" />,
      sql: <Database className="h-4 w-4" />
    };

    const cellBorder = {
      code: 'border-blue-500',
      markdown: 'border-green-500',
      visualization: 'border-purple-500',
      sql: 'border-orange-500'
    };

    return (
      <motion.div
        key={cell.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative group ${cell.isVisible ? 'block' : 'hidden'}`}
        draggable
        onDragStart={() => handleDragStart(cell.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, cell.id)}
      >
        <Card className={`bg-[#2a2f36] border-l-4 ${cellBorder[cell.type]} border-r-0 border-t-0 border-b-0`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-white/40 cursor-move" />
                {cellIcon[cell.type]}
                <span className="text-sm text-white/70 capitalize">{cell.type}</span>
                {cell.collaborators && cell.collaborators.length > 0 && (
                  <div className="flex -space-x-1">
                    {cell.collaborators.map(userId => {
                      const user = collaborators.find(c => c.id === userId);
                      return user ? (
                        <Avatar key={userId} className="h-5 w-5 border border-white/20">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs bg-[#14b8a6]">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCellExecution(cell.id)}
                        disabled={cell.isExecuting || readOnly}
                      >
                        {cell.isExecuting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Run Cell</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAddCell('code', cell.id)}>
                      Add Code Cell
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddCell('markdown', cell.id)}>
                      Add Markdown Cell
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddCell('visualization', cell.id)}>
                      Add Visualization Cell
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddCell('sql', cell.id)}>
                      Add SQL Cell
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem onClick={() => handleDeleteCell(cell.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Cell
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Textarea
                value={cell.content}
                onChange={(e) => handleCellContentChange(cell.id, e.target.value)}
                placeholder={`Enter ${cell.type} here...`}
                className="min-h-[100px] font-mono text-sm bg-[#1a1d21] border-white/20 resize-none"
                readOnly={readOnly}
              />
              
              {cell.isExecuting && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Executing...
                </div>
              )}
              
              {cell.output && !cell.isExecuting && (
                <div className="border-t border-white/20 pt-3">
                  <div className="bg-[#1a1d21] rounded p-3 font-mono text-sm text-white/90">
                    {cell.type === 'sql' && cell.output.type === 'table' ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-white/20">
                          <thead>
                            <tr className="bg-white/10">
                              {Object.keys(cell.output.data[0]).map(key => (
                                <th key={key} className="border border-white/20 px-2 py-1 text-left">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {cell.output.data.map((row: any, i: number) => (
                              <tr key={i}>
                                {Object.values(row).map((value: any, j: number) => (
                                  <td key={j} className="border border-white/20 px-2 py-1">
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : cell.type === 'visualization' && cell.output.type === 'chart' ? (
                      <div className="h-64 bg-white/5 rounded flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-white/40" />
                        <span className="ml-2 text-white/60">{cell.output.data}</span>
                      </div>
                    ) : cell.type === 'markdown' ? (
                      <div className="prose prose-invert max-w-none">
                        {cell.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap">{cell.output.text}</pre>
                    )}
                  </div>
                  
                  {cell.executionTime && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                      <Clock className="h-3 w-3" />
                      Executed in {cell.executionTime.toFixed(2)}s
                    </div>
                  )}
                </div>
              )}
              
              {cell.error && (
                <div className="border-t border-red-500/20 pt-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-sm text-red-400">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Error</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">{cell.error}</pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={`h-screen flex ${isFullScreen ? 'fixed inset-0 z-50' : ''} ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${isFullScreen ? 'hidden' : 'w-80'} bg-[#1a1d21] border-r border-white/20 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-white">Databricks</h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Theme</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullScreen(!isFullScreen)}
                    >
                      {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Full Screen</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
              <TabsTrigger value="kernels" className="text-xs">Kernels</TabsTrigger>
              <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
              <TabsContent value="files" className="space-y-2 mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-1">
                  {renderFileTree(demoFiles)}
                </div>
              </TabsContent>
              
              <TabsContent value="kernels" className="space-y-3 mt-0">
                <div className="space-y-2">
                  <Select value={selectedKernel} onValueChange={setSelectedKernel}>
                    <SelectTrigger className="bg-white/10 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {demoKernels.map(kernel => (
                        <SelectItem key={kernel.id} value={kernel.id}>
                          <div className="flex items-center gap-2">
                            <Circle className={`h-2 w-2 ${
                              kernel.status === 'idle' ? 'fill-green-500' :
                              kernel.status === 'busy' ? 'fill-yellow-500' :
                              'fill-red-500'
                            }`} />
                            {kernel.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/90">Variables</h3>
                  {variables.map(variable => (
                    <div key={variable.name} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div>
                        <span className="text-sm text-white/90 font-mono">{variable.name}</span>
                        <span className="text-xs text-white/60 ml-2">{variable.type}</span>
                      </div>
                      <span className="text-xs text-white/60">{variable.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-3 mt-0">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/90">Data Sources</h3>
                  <div className="space-y-1">
                    {['sales_data.csv', 'customer_info.json', 'product_catalog.parquet'].map(source => (
                      <div key={source} className="flex items-center gap-2 p-2 bg-white/5 rounded hover:bg-white/10 cursor-pointer">
                        <Database className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-white/90">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-3 mt-0">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/90">Run History</h3>
                  <div className="space-y-1">
                    {demoRunHistory.map(run => (
                      <div key={run.id} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                        <div className={`p-1 rounded ${
                          run.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {run.status === 'success' ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-white/90">{run.cellId}</div>
                          <div className="text-xs text-white/60">{run.duration}s</div>
                        </div>
                        <div className="text-xs text-white/60">
                          {run.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Notebook Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Customer Segmentation Analysis</h2>
            <Badge variant="outline" className="text-xs">
              {selectedKernel && demoKernels.find(k => k.id === selectedKernel)?.name}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Collaborators */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div className="flex -space-x-2">
                {collaborators.filter(c => c.isActive).map(collaborator => (
                  <TooltipProvider key={collaborator.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback className="bg-[#14b8a6] text-white text-xs">
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>{collaborator.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                    Add Cell
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAddCell('code')}>
                    <Code className="h-4 w-4 mr-2" />
                    Code Cell
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddCell('markdown')}>
                    <Type className="h-4 w-4 mr-2" />
                    Markdown Cell
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddCell('visualization')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Visualization Cell
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddCell('sql')}>
                    <Database className="h-4 w-4 mr-2" />
                    SQL Cell
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Notebook Content */}
        <ScrollArea className="flex-1 bg-gray-50">
          <div ref={notebookRef} className="max-w-4xl mx-auto p-6 space-y-4">
            <AnimatePresence>
              {cells.map(cell => renderCell(cell))}
            </AnimatePresence>
            
            {cells.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cells yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first cell to begin analysis</p>
                <Button onClick={() => handleAddCell('code')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Code Cell
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Collaborative Cursors */}
      <AnimatePresence>
        {collaborators.filter(c => c.isActive && c.cursor).map(collaborator => (
          <motion.div
            key={collaborator.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              left: collaborator.cursor!.x,
              top: collaborator.cursor!.y,
              pointerEvents: 'none',
              zIndex: 1000
            }}
            className="flex items-center gap-2"
          >
            <div className="w-4 h-4 bg-[#14b8a6] rounded-full border-2 border-white shadow-lg" />
            <div className="bg-[#14b8a6] text-white text-xs px-2 py-1 rounded shadow-lg">
              {collaborator.name}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 