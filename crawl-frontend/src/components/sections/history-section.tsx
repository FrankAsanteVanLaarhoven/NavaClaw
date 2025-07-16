"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  BarChart3,
  LineChart,
  Archive,
  Database,
  Settings,
  Eye,
  Globe,
  Zap,
  Timer,
  Users,
  MapPin,
  Wifi,
  HardDrive,
  RefreshCw,
  FileText,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  ExternalLink,
  Calendar as CalendarIcon,
  Clock4,
  Server,
  Target,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  XCircle as XCircleIcon,
  Play,
  Pause,
  Square,
  RotateCcw,
  Trash2,
  FolderOpen,
  Share2,
  Copy,
  Edit3,
  Save,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Grid3x3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
  SkipBack,
  SkipForward,
  Loader,
  Bookmark,
  BookOpen,
  Code,
  Bug,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Types
interface CrawlActivity {
  id: string;
  timestamp: string;
  type: 'start' | 'complete' | 'error' | 'pause' | 'resume' | 'cancel';
  crawler: string;
  url: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  pagesProcessed?: number;
  errorCount?: number;
  message: string;
  details?: {
    userAgent?: string;
    responseTime?: number;
    statusCode?: number;
    contentType?: string;
    dataSize?: number;
    retryCount?: number;
    errorDetails?: string;
  };
}

interface CrawlSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  crawlerName: string;
  baseUrl: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  totalPages: number;
  processedPages: number;
  successfulPages: number;
  errorPages: number;
  dataSize: number;
  averageResponseTime: number;
  errors: Array<{
    page: string;
    error: string;
    timestamp: string;
    statusCode?: number;
  }>;
  configuration: {
    maxPages: number;
    delay: number;
    timeout: number;
    retryAttempts: number;
    respectedRobots: boolean;
    userAgent: string;
  };
}

interface HistoryMetrics {
  totalActivities: number;
  totalSessions: number;
  successRate: number;
  averageDuration: number;
  totalDataProcessed: number;
  activeTimeRange: {
    start: string;
    end: string;
  };
  topCrawlers: Array<{
    name: string;
    count: number;
    successRate: number;
  }>;
}

interface ChartData {
  date: string;
  sessions: number;
  success: number;
  errors: number;
  dataSize: number;
  avgResponseTime: number;
}

// Mock data generators
const generateMockActivities = (): CrawlActivity[] => {
  const activities: CrawlActivity[] = [];
  const crawlers = ['WebCrawler Pro', 'DataHarvester', 'SiteMapper', 'ContentExtractor', 'LinkCrawler'];
  const urls = [
    'https://example.com',
    'https://blog.example.com',
    'https://shop.example.com',
    'https://docs.example.com',
    'https://api.example.com'
  ];
  const types: CrawlActivity['type'][] = ['start', 'complete', 'error', 'pause', 'resume', 'cancel'];
  const statuses: CrawlActivity['status'][] = ['success', 'error', 'warning', 'info'];

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    const type = types[Math.floor(Math.random() * types.length)];
    const status = type === 'complete' ? 'success' : 
                  type === 'error' ? 'error' : 
                  type === 'start' ? 'info' : 
                  statuses[Math.floor(Math.random() * statuses.length)];

    activities.push({
      id: `activity-${i}`,
      timestamp,
      type,
      crawler: crawlers[Math.floor(Math.random() * crawlers.length)],
      url: urls[Math.floor(Math.random() * urls.length)],
      status,
      duration: type === 'complete' ? Math.floor(Math.random() * 300000) + 10000 : undefined,
      pagesProcessed: type === 'complete' ? Math.floor(Math.random() * 500) + 10 : undefined,
      errorCount: Math.floor(Math.random() * 5),
      message: getActivityMessage(type, status),
      details: {
        userAgent: 'Mozilla/5.0 (compatible; WebCrawler/1.0)',
        responseTime: Math.floor(Math.random() * 2000) + 100,
        statusCode: status === 'error' ? 404 : 200,
        contentType: 'text/html',
        dataSize: Math.floor(Math.random() * 1000000) + 10000,
        retryCount: Math.floor(Math.random() * 3),
        errorDetails: status === 'error' ? 'Connection timeout' : undefined
      }
    });
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockSessions = (): CrawlSession[] => {
  const sessions: CrawlSession[] = [];
  const crawlers = ['WebCrawler Pro', 'DataHarvester', 'SiteMapper', 'ContentExtractor', 'LinkCrawler'];
  const urls = [
    'https://example.com',
    'https://blog.example.com',
    'https://shop.example.com',
    'https://docs.example.com',
    'https://api.example.com'
  ];
  const statuses: CrawlSession['status'][] = ['completed', 'failed', 'cancelled', 'running'];

  for (let i = 0; i < 25; i++) {
    const startTime = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const duration = status === 'running' ? undefined : Math.floor(Math.random() * 600000) + 30000;
    const endTime = duration ? new Date(new Date(startTime).getTime() + duration).toISOString() : undefined;
    const totalPages = Math.floor(Math.random() * 1000) + 50;
    const processedPages = status === 'running' ? Math.floor(totalPages * 0.3) : totalPages;
    const successfulPages = Math.floor(processedPages * (0.7 + Math.random() * 0.3));
    const errorPages = processedPages - successfulPages;

    sessions.push({
      id: `session-${i}`,
      startTime,
      endTime,
      duration,
      crawlerName: crawlers[Math.floor(Math.random() * crawlers.length)],
      baseUrl: urls[Math.floor(Math.random() * urls.length)],
      status,
      totalPages,
      processedPages,
      successfulPages,
      errorPages,
      dataSize: Math.floor(Math.random() * 10000000) + 100000,
      averageResponseTime: Math.floor(Math.random() * 1000) + 200,
      errors: generateSessionErrors(errorPages),
      configuration: {
        maxPages: totalPages,
        delay: Math.floor(Math.random() * 3000) + 1000,
        timeout: Math.floor(Math.random() * 30000) + 10000,
        retryAttempts: Math.floor(Math.random() * 5) + 1,
        respectedRobots: Math.random() > 0.3,
        userAgent: 'Mozilla/5.0 (compatible; WebCrawler/1.0)'
      }
    });
  }

  return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

const generateSessionErrors = (count: number) => {
  const errors = [];
  for (let i = 0; i < count; i++) {
    errors.push({
      page: `/page-${i + 1}`,
      error: ['Connection timeout', 'Page not found', 'Server error', 'Rate limit exceeded'][Math.floor(Math.random() * 4)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      statusCode: [404, 500, 503, 429][Math.floor(Math.random() * 4)]
    });
  }
  return errors;
};

const generateMockMetrics = (): HistoryMetrics => ({
  totalActivities: 247,
  totalSessions: 89,
  successRate: 87.3,
  averageDuration: 145000,
  totalDataProcessed: 2.4e9,
  activeTimeRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString()
  },
  topCrawlers: [
    { name: 'WebCrawler Pro', count: 45, successRate: 92.1 },
    { name: 'DataHarvester', count: 38, successRate: 88.5 },
    { name: 'SiteMapper', count: 32, successRate: 85.7 },
    { name: 'ContentExtractor', count: 28, successRate: 90.3 },
    { name: 'LinkCrawler', count: 24, successRate: 83.2 }
  ]
});

const generateMockChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 15) + 5,
      success: Math.floor(Math.random() * 12) + 8,
      errors: Math.floor(Math.random() * 5) + 1,
      dataSize: Math.floor(Math.random() * 100000000) + 10000000,
      avgResponseTime: Math.floor(Math.random() * 500) + 200
    });
  }
  return data;
};

const getActivityMessage = (type: CrawlActivity['type'], status: CrawlActivity['status']): string => {
  const messages = {
    start: { 
      info: 'Crawling session started',
      success: 'Crawling session started successfully',
      warning: 'Crawling session started with warnings',
      error: 'Failed to start crawling session'
    },
    complete: {
      success: 'Crawling session completed successfully',
      warning: 'Crawling session completed with warnings',
      error: 'Crawling session completed with errors',
      info: 'Crawling session completed'
    },
    error: {
      error: 'Critical error occurred during crawling',
      warning: 'Non-critical error occurred',
      info: 'Error logged for debugging',
      success: 'Error resolved'
    },
    pause: {
      info: 'Crawling session paused',
      warning: 'Crawling session paused due to issues',
      error: 'Crawling session paused due to errors',
      success: 'Crawling session paused successfully'
    },
    resume: {
      info: 'Crawling session resumed',
      success: 'Crawling session resumed successfully',
      warning: 'Crawling session resumed with warnings',
      error: 'Failed to resume crawling session'
    },
    cancel: {
      info: 'Crawling session cancelled',
      warning: 'Crawling session cancelled due to issues',
      error: 'Crawling session cancelled due to errors',
      success: 'Crawling session cancelled successfully'
    }
  };
  return messages[type][status];
};

const getStatusIcon = (status: CrawlActivity['status']) => {
  switch (status) {
    case 'success': return CheckCircle;
    case 'error': return XCircle;
    case 'warning': return AlertCircle;
    case 'info': return Info;
    default: return Info;
  }
};

const getStatusColor = (status: CrawlActivity['status']) => {
  switch (status) {
    case 'success': return 'text-green-600';
    case 'error': return 'text-red-600';
    case 'warning': return 'text-yellow-600';
    case 'info': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

const getStatusBadgeColor = (status: CrawlActivity['status']) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'error': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'info': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

const formatBytes = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

// Chart components
const ActivityChart = ({ data }: { data: ChartData[] }) => {
  const maxSessions = Math.max(...data.map(d => d.sessions));
  const maxDataSize = Math.max(...data.map(d => d.dataSize));
  
  return (
    <div className="h-64 w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Activity Timeline</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>Sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Data Size</span>
          </div>
        </div>
      </div>
      <div className="relative h-48">
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={y * 192}
              x2="100%"
              y2={y * 192}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Sessions line */}
          <polyline
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2"
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}%,${192 - (d.sessions / maxSessions) * 192}`
            ).join(' ')}
          />
          
          {/* Data size line */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}%,${192 - (d.dataSize / maxDataSize) * 192}`
            ).join(' ')}
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={192 - (d.sessions / maxSessions) * 192}
                r="3"
                fill="#14b8a6"
              />
              <circle
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={192 - (d.dataSize / maxDataSize) * 192}
                r="3"
                fill="#6366f1"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

const SuccessRateChart = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="h-64 w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Success Rate Trend</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Success</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Errors</span>
          </div>
        </div>
      </div>
      <div className="relative h-48">
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={y * 192}
              x2="100%"
              y2={y * 192}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Success area */}
          <polygon
            fill="rgba(34, 197, 94, 0.1)"
            stroke="#22c55e"
            strokeWidth="2"
            points={`0,192 ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}%,${192 - ((d.success / (d.success + d.errors)) * 192)}`
            ).join(' ')} 100%,192`}
          />
          
          {/* Error area */}
          <polygon
            fill="rgba(239, 68, 68, 0.1)"
            stroke="#ef4444"
            strokeWidth="2"
            points={`0,0 ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}%,${(d.errors / (d.success + d.errors)) * 192}`
            ).join(' ')} 100%,0`}
          />
        </svg>
      </div>
    </div>
  );
};

const ResponseTimeChart = ({ data }: { data: ChartData[] }) => {
  const maxResponseTime = Math.max(...data.map(d => d.avgResponseTime));
  
  return (
    <div className="h-64 w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Average Response Time</h4>
        <span className="text-xs text-gray-500">milliseconds</span>
      </div>
      <div className="relative h-48">
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={y * 192}
              x2="100%"
              y2={y * 192}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Response time bars */}
          {data.map((d, i) => (
            <rect
              key={i}
              x={`${(i / data.length) * 100}%`}
              y={192 - (d.avgResponseTime / maxResponseTime) * 192}
              width={`${(1 / data.length) * 80}%`}
              height={(d.avgResponseTime / maxResponseTime) * 192}
              fill="#f59e0b"
              opacity="0.7"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

// Main component
export const HistorySection = () => {
  const [activities] = useState<CrawlActivity[]>(generateMockActivities());
  const [sessions] = useState<CrawlSession[]>(generateMockSessions());
  const [metrics] = useState<HistoryMetrics>(generateMockMetrics());
  const [chartData] = useState<ChartData[]>(generateMockChartData());
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedActivity, setSelectedActivity] = useState<CrawlActivity | null>(null);
  const [selectedSession, setSelectedSession] = useState<CrawlSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [crawlerFilter, setCrawlerFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [sortBy, setSortBy] = useState<'timestamp' | 'duration' | 'pages'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = activities.filter(activity => {
      const matchesSearch = activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.crawler.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.url.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
      const matchesCrawler = crawlerFilter === 'all' || activity.crawler === crawlerFilter;
      
      const activityDate = new Date(activity.timestamp);
      const matchesDateRange = (!dateRange.from || activityDate >= dateRange.from) &&
                              (!dateRange.to || activityDate <= dateRange.to);
      
      return matchesSearch && matchesStatus && matchesCrawler && matchesDateRange;
    });

    // Sort activities
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === 'duration') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortBy === 'pages') {
        aValue = a.pagesProcessed || 0;
        bValue = b.pagesProcessed || 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [activities, searchTerm, statusFilter, crawlerFilter, dateRange, sortBy, sortOrder]);

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter(session => {
      const matchesSearch = session.crawlerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.baseUrl.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      const matchesCrawler = crawlerFilter === 'all' || session.crawlerName === crawlerFilter;
      
      const sessionDate = new Date(session.startTime);
      const matchesDateRange = (!dateRange.from || sessionDate >= dateRange.from) &&
                              (!dateRange.to || sessionDate <= dateRange.to);
      
      return matchesSearch && matchesStatus && matchesCrawler && matchesDateRange;
    });

    return filtered.sort((a, b) => 
      sortOrder === 'asc' 
        ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        : new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }, [sessions, searchTerm, statusFilter, crawlerFilter, dateRange, sortOrder]);

  const uniqueCrawlers = useMemo(() => {
    const crawlers = new Set(activities.map(a => a.crawler));
    return Array.from(crawlers);
  }, [activities]);

  const ActivityTimeline = () => (
    <div className="space-y-4">
      {filteredActivities.map((activity, index) => {
        const StatusIcon = getStatusIcon(activity.status);
        const isLast = index === filteredActivities.length - 1;
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex items-start space-x-4 pb-4"
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-6 top-10 w-0.5 h-full bg-gray-200"></div>
            )}
            
            {/* Status icon */}
            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-white shadow-md ${
              activity.status === 'success' ? 'bg-green-100' :
              activity.status === 'error' ? 'bg-red-100' :
              activity.status === 'warning' ? 'bg-yellow-100' :
              'bg-blue-100'
            }`}>
              <StatusIcon className={`w-5 h-5 ${getStatusColor(activity.status)}`} />
            </div>
            
            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => setSelectedActivity(activity)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${getStatusBadgeColor(activity.status)}`}>
                        {activity.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">{activity.crawler}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{activity.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {activity.url}
                      </span>
                      {activity.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(activity.duration)}
                        </span>
                      )}
                      {activity.pagesProcessed && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {activity.pagesProcessed} pages
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Card>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const ActivityTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">
              <Button variant="ghost" size="sm" onClick={() => {
                setSortBy('timestamp');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}>
                Timestamp
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Crawler</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" onClick={() => {
                setSortBy('duration');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}>
                Duration
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" onClick={() => {
                setSortBy('pages');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}>
                Pages
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-gray-50">
              <TableCell className="font-mono text-xs">
                {new Date(activity.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge className={`text-xs ${getStatusBadgeColor(activity.status)}`}>
                  {activity.status}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{activity.crawler}</TableCell>
              <TableCell className="max-w-[200px] truncate">{activity.url}</TableCell>
              <TableCell className="max-w-[300px] truncate">{activity.message}</TableCell>
              <TableCell className="text-right">
                {activity.duration ? formatDuration(activity.duration) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {activity.pagesProcessed || '-'}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const SessionsList = () => (
    <div className="space-y-4">
      {filteredSessions.map((session) => (
        <Card key={session.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSession(session)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${
                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                  session.status === 'failed' ? 'bg-red-100 text-red-800' :
                  session.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {session.status.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium text-gray-900">{session.crawlerName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(session.startTime).toLocaleString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{session.baseUrl}</p>
              
              <div className="flex items-center gap-6 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.duration ? formatDuration(session.duration) : 'Running...'}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {session.processedPages}/{session.totalPages} pages
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {formatBytes(session.dataSize)}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  {session.averageResponseTime}ms avg
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round((session.processedPages / session.totalPages) * 100)}%</span>
                  </div>
                  <Progress value={(session.processedPages / session.totalPages) * 100} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    {session.successfulPages}
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-3 h-3" />
                    {session.errorPages}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-sm text-gray-500">
            Complete audit trail of all crawling activities and sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Backup
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalActivities)}</p>
            </div>
            <Activity className="w-8 h-8 text-teal-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.successRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(metrics.averageDuration)}</p>
            </div>
            <Timer className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Data Processed</p>
              <p className="text-2xl font-bold text-gray-900">{formatBytes(metrics.totalDataProcessed)}</p>
            </div>
            <Database className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <ActivityChart data={chartData} />
        </Card>
        
        <Card className="p-4">
          <SuccessRateChart data={chartData} />
        </Card>
        
        <Card className="p-4">
          <ResponseTimeChart data={chartData} />
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search activities, crawlers, or URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div>
              <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="crawler-filter" className="text-sm font-medium">Crawler</Label>
              <Select value={crawlerFilter} onValueChange={setCrawlerFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All crawlers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crawlers</SelectItem>
                  {uniqueCrawlers.map(crawler => (
                    <SelectItem key={crawler} value={crawler}>{crawler}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "LLL dd")} - ${format(dateRange.to, "LLL dd")}`
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {activeTab === 'timeline' && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <List className="w-4 h-4 mr-2" />
                Timeline
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Table
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Activity Timeline</h3>
              <span className="text-sm text-gray-500">
                {filteredActivities.length} of {activities.length} activities
              </span>
            </div>
            <ScrollArea className="h-[600px]">
              {viewMode === 'timeline' ? <ActivityTimeline /> : <ActivityTable />}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crawl Sessions</h3>
              <span className="text-sm text-gray-500">
                {filteredSessions.length} of {sessions.length} sessions
              </span>
            </div>
            <ScrollArea className="h-[600px]">
              <SessionsList />
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Top Crawlers</h3>
              <div className="space-y-3">
                {metrics.topCrawlers.map((crawler, index) => (
                  <div key={crawler.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-teal-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{crawler.name}</p>
                        <p className="text-sm text-gray-500">{crawler.count} sessions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{crawler.successRate}%</p>
                      <p className="text-sm text-gray-500">success rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
              <div className="grid grid-cols-7 gap-1">
                {/* Heatmap would go here - simplified representation */}
                {Array.from({ length: 49 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded ${
                      Math.random() > 0.7 ? 'bg-teal-500' :
                      Math.random() > 0.5 ? 'bg-teal-300' :
                      Math.random() > 0.3 ? 'bg-teal-100' :
                      'bg-gray-100'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <div className="w-3 h-3 bg-teal-100 rounded"></div>
                  <div className="w-3 h-3 bg-teal-300 rounded"></div>
                  <div className="w-3 h-3 bg-teal-500 rounded"></div>
                </div>
                <span>More</span>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity Detail Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <p className="text-sm">{new Date(selectedActivity.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={`text-xs ${getStatusBadgeColor(selectedActivity.status)}`}>
                    {selectedActivity.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Crawler</Label>
                  <p className="text-sm">{selectedActivity.crawler}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">URL</Label>
                  <p className="text-sm break-all">{selectedActivity.url}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <p className="text-sm">{selectedActivity.message}</p>
              </div>
              
              {selectedActivity.details && (
                <div>
                  <Label className="text-sm font-medium">Technical Details</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-xs text-gray-700">
                      {JSON.stringify(selectedActivity.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Detail Modal */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Session ID</Label>
                  <p className="text-sm font-mono">{selectedSession.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={`text-xs ${
                    selectedSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedSession.status === 'failed' ? 'bg-red-100 text-red-800' :
                    selectedSession.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSession.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Crawler</Label>
                  <p className="text-sm">{selectedSession.crawlerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Base URL</Label>
                  <p className="text-sm break-all">{selectedSession.baseUrl}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Time</Label>
                  <p className="text-sm">{new Date(selectedSession.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{selectedSession.duration ? formatDuration(selectedSession.duration) : 'Running...'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedSession.processedPages}</p>
                  <p className="text-sm text-gray-500">Pages Processed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedSession.successfulPages}</p>
                  <p className="text-sm text-gray-500">Successful</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{selectedSession.errorPages}</p>
                  <p className="text-sm text-gray-500">Errors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{formatBytes(selectedSession.dataSize)}</p>
                  <p className="text-sm text-gray-500">Data Size</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Configuration</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(selectedSession.configuration, null, 2)}
                  </pre>
                </div>
              </div>
              
              {selectedSession.errors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Errors ({selectedSession.errors.length})</Label>
                  <ScrollArea className="h-40 mt-2">
                    <div className="space-y-2">
                      {selectedSession.errors.map((error, index) => (
                        <div key={index} className="p-2 bg-red-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-red-800">{error.page}</p>
                              <p className="text-xs text-red-600">{error.error}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="destructive" className="text-xs">
                                {error.statusCode}
                              </Badge>
                              <p className="text-xs text-red-500 mt-1">
                                {new Date(error.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistorySection;