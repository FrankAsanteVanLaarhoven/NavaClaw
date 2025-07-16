"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  BarChart3,
  PieChart,
  LineChart,
  Map,
  FileSpreadsheet,
  FilePdf,
  FileJson,
  Mail,
  Settings,
  Trash2,
  Copy,
  RefreshCw,
  Zap,
  Globe,
  Server,
  Users,
  Timer,
  BookOpen,
  Target,
  Layers,
  Database
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: 'performance' | 'content' | 'seo' | 'errors' | 'custom';
  status: 'completed' | 'processing' | 'scheduled' | 'failed';
  createdAt: Date;
  size: string;
  format: 'pdf' | 'excel' | 'json' | 'csv';
  dataPoints: number;
  tags: string[];
  description: string;
  downloadUrl?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: React.ReactNode;
  defaultFilters: string[];
  estimatedTime: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Weekly Performance Summary',
    type: 'performance',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    size: '2.4 MB',
    format: 'pdf',
    dataPoints: 15420,
    tags: ['weekly', 'performance', 'automated'],
    description: 'Comprehensive performance analysis for the past week',
    downloadUrl: '#'
  },
  {
    id: '2',
    name: 'SEO Content Analysis',
    type: 'seo',
    status: 'processing',
    createdAt: new Date('2024-01-14'),
    size: '1.8 MB',
    format: 'excel',
    dataPoints: 8750,
    tags: ['seo', 'content', 'analysis'],
    description: 'Detailed SEO metrics and content optimization insights'
  },
  {
    id: '3',
    name: 'Error Distribution Report',
    type: 'errors',
    status: 'completed',
    createdAt: new Date('2024-01-13'),
    size: '945 KB',
    format: 'json',
    dataPoints: 3240,
    tags: ['errors', 'debugging', 'monitoring'],
    description: 'Analysis of crawler errors and failed requests',
    downloadUrl: '#'
  },
  {
    id: '4',
    name: 'Monthly Custom Report',
    type: 'custom',
    status: 'scheduled',
    createdAt: new Date('2024-01-16'),
    size: '3.2 MB',
    format: 'pdf',
    dataPoints: 22100,
    tags: ['monthly', 'custom', 'comprehensive'],
    description: 'Custom report with selected metrics and visualizations'
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Performance Overview',
    description: 'Comprehensive performance metrics and trends',
    type: 'performance',
    icon: <TrendingUp className="w-6 h-6" />,
    defaultFilters: ['response_time', 'success_rate', 'throughput'],
    estimatedTime: '2-3 minutes'
  },
  {
    id: '2',
    name: 'Content Analysis',
    description: 'Content quality and structure insights',
    type: 'content',
    icon: <FileText className="w-6 h-6" />,
    defaultFilters: ['content_type', 'size', 'language'],
    estimatedTime: '3-5 minutes'
  },
  {
    id: '3',
    name: 'SEO Audit',
    description: 'Search engine optimization analysis',
    type: 'seo',
    icon: <Target className="w-6 h-6" />,
    defaultFilters: ['meta_tags', 'headings', 'keywords'],
    estimatedTime: '5-8 minutes'
  },
  {
    id: '4',
    name: 'Error Analysis',
    description: 'Error tracking and debugging insights',
    type: 'errors',
    icon: <AlertCircle className="w-6 h-6" />,
    defaultFilters: ['error_codes', 'failed_requests', 'retry_attempts'],
    estimatedTime: '1-2 minutes'
  }
];

const performanceData: ChartData[] = [
  { name: 'Jan', value: 85, color: '#14b8a6' },
  { name: 'Feb', value: 78, color: '#14b8a6' },
  { name: 'Mar', value: 92, color: '#14b8a6' },
  { name: 'Apr', value: 88, color: '#14b8a6' },
  { name: 'May', value: 95, color: '#14b8a6' },
  { name: 'Jun', value: 91, color: '#14b8a6' }
];

const errorDistribution: ChartData[] = [
  { name: '404 Errors', value: 45, color: '#ef4444' },
  { name: '500 Errors', value: 23, color: '#f59e0b' },
  { name: '403 Errors', value: 18, color: '#6366f1' },
  { name: 'Timeout', value: 14, color: '#10b981' }
];

const SimpleLineChart = ({ data }: { data: ChartData[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 300,
    y: 150 - (d.value / maxValue) * 120
  }));
  
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  return (
    <svg width="300" height="150" className="w-full h-full">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L 300,150 L 0,150 Z`}
        fill="url(#gradient)"
      />
      <path
        d={pathData}
        fill="none"
        stroke="#14b8a6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="3"
          fill="#14b8a6"
          className="hover:r-4 transition-all"
        />
      ))}
    </svg>
  );
};

const SimplePieChart = ({ data }: { data: ChartData[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <svg width="150" height="150" className="w-full h-full">
      {data.map((d, i) => {
        const percentage = (d.value / total) * 100;
        const startAngle = (cumulativePercentage / 100) * 360;
        const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
        cumulativePercentage += percentage;
        
        const largeArcFlag = percentage > 50 ? 1 : 0;
        const startX = 75 + 60 * Math.cos((startAngle - 90) * Math.PI / 180);
        const startY = 75 + 60 * Math.sin((startAngle - 90) * Math.PI / 180);
        const endX = 75 + 60 * Math.cos((endAngle - 90) * Math.PI / 180);
        const endY = 75 + 60 * Math.sin((endAngle - 90) * Math.PI / 180);
        
        return (
          <path
            key={i}
            d={`M 75 75 L ${startX} ${startY} A 60 60 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
            fill={d.color}
            className="hover:opacity-80 transition-opacity"
          />
        );
      })}
    </svg>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'processing': return 'bg-blue-500';
    case 'scheduled': return 'bg-yellow-500';
    case 'failed': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'performance': return 'bg-teal-500';
    case 'content': return 'bg-purple-500';
    case 'seo': return 'bg-green-500';
    case 'errors': return 'bg-red-500';
    case 'custom': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ReportsSection = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleGenerateReport = () => {
    // Mock report generation logic
    console.log('Generating report:', {
      name: reportName,
      type: reportType,
      description: reportDescription,
      format: outputFormat,
      domains: selectedDomains,
      dateRange,
      scheduled: isScheduled,
      frequency: scheduleFrequency
    });
    setIsGenerateDialogOpen(false);
    // Reset form
    setReportName('');
    setReportType('');
    setReportDescription('');
    setOutputFormat('pdf');
    setSelectedDomains([]);
    setIsScheduled(false);
    setScheduleFrequency('weekly');
  };

  const handleBulkAction = (action: 'download' | 'delete' | 'share') => {
    console.log(`Bulk ${action} for reports:`, selectedReports);
    setSelectedReports([]);
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const selectAllReports = () => {
    setSelectedReports(
      selectedReports.length === filteredReports.length 
        ? [] 
        : filteredReports.map(r => r.id)
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
            <p className="text-lg text-gray-600 mt-1">
              Generate insights and analyze your crawl data
            </p>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="errors">Errors</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Brief description of the report"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="output-format">Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                            ) : (
                              dateRange.from.toLocaleDateString()
                            )
                          ) : (
                            "Select date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scheduled"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                  <Label htmlFor="scheduled">Schedule recurring report</Label>
                </div>

                {isScheduled && (
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsGenerateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGenerateReport}
                    disabled={!reportName || !reportType}
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Reports</p>
                    <p className="text-2xl font-bold text-blue-900">247</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-700">Data Processed</p>
                    <p className="text-2xl font-bold text-teal-900">1.2TB</p>
                  </div>
                  <div className="p-3 bg-teal-500 rounded-full">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8% from last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Insights Generated</p>
                    <p className="text-2xl font-bold text-purple-900">3,847</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+23% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Avg. Generation Time</p>
                    <p className="text-2xl font-bold text-green-900">2.3m</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-15% from last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports Library</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Data Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <SimpleLineChart data={performanceData} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Error Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48">
                    <div className="w-48 h-48">
                      <SimplePieChart data={errorDistribution} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {errorDistribution.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReports.slice(0, 3).map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`${getTypeColor(report.type)} text-white`}>
                              {report.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {report.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                        <span className="text-sm capitalize">{report.status}</span>
                        {report.downloadUrl && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="errors">Errors</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedReports.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="text-sm font-medium text-blue-700">
                  {selectedReports.length} report(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('download')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('share')}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedReports.includes(report.id)}
                            onCheckedChange={() => toggleReportSelection(report.id)}
                          />
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                          <span className="text-xs capitalize text-gray-500">
                            {report.status}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {report.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {report.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <Badge className={`ml-2 ${getTypeColor(report.type)} text-white`}>
                            {report.type}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-gray-500">Format:</span>
                          <span className="ml-2 font-medium">{report.format.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-2 font-medium">{report.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Data Points:</span>
                          <span className="ml-2 font-medium">{report.dataPoints.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {report.createdAt.toLocaleDateString()}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <div className="flex gap-1">
                          {report.downloadUrl && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <p className="text-sm text-gray-600">
                  Choose from pre-built templates or create your own custom reports
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {reportTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-pointer"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            {template.icon}
                          </div>
                          <h3 className="font-semibold mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {template.description}
                          </p>
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500">
                              Est. time: {template.estimatedTime}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setReportType(template.type);
                                setIsGenerateDialogOpen(true);
                              }}
                            >
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage automated report generation and delivery
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Scheduled reports would go here */}
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Scheduled Reports
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Set up automated report generation to receive regular insights
                    </p>
                    <Button
                      onClick={() => {
                        setIsScheduled(true);
                        setIsGenerateDialogOpen(true);
                      }}
                    >
                      Schedule New Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};