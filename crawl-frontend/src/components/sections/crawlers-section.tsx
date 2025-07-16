"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Activity,
  Zap,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  PauseCircle,
  Settings,
  BarChart3,
  Database,
  Wifi,
  Cpu,
  HardDrive,
  Timer,
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  Loader
} from 'lucide-react';

interface CrawlerStatus {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  progress: number;
  pagesPerSecond: number;
  successRate: number;
  errorCount: number;
  totalPages: number;
  queueSize: number;
  cpuUsage: number;
  memoryUsage: number;
  bandwidth: number;
  lastActivity: string;
  startTime: string;
  targetDomain: string;
  configuration: {
    depth: number;
    frequency: string;
    concurrent: number;
    rateLimit: number;
    userAgent: string;
    respectRobots: boolean;
    followRedirects: boolean;
    timeout: number;
  };
}

interface QueueItem {
  id: string;
  url: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'failed';
  attempts: number;
  lastAttempt: string;
}

const statusConfig = {
  running: { 
    icon: CheckCircle, 
    color: 'bg-green-500', 
    textColor: 'text-green-400',
    badge: 'bg-green-500/20 text-green-400'
  },
  paused: { 
    icon: PauseCircle, 
    color: 'bg-yellow-500', 
    textColor: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400'
  },
  stopped: { 
    icon: Square, 
    color: 'bg-gray-500', 
    textColor: 'text-gray-400',
    badge: 'bg-gray-500/20 text-gray-400'
  },
  error: { 
    icon: XCircle, 
    color: 'bg-red-500', 
    textColor: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400'
  }
};

export const CrawlersSection = () => {
  const [crawlers, setCrawlers] = useState<CrawlerStatus[]>([]);
  const [selectedCrawler, setSelectedCrawler] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastActivity');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [newCrawler, setNewCrawler] = useState({
    name: '',
    targetDomain: '',
    depth: 3,
    frequency: 'medium',
    concurrent: 10,
    rateLimit: 1000,
    userAgent: 'CrawlerBot/1.0',
    respectRobots: true,
    followRedirects: true,
    timeout: 30000
  });

  // Mock data initialization
  useEffect(() => {
    const mockCrawlers: CrawlerStatus[] = [
      {
        id: '1',
        name: 'E-commerce Product Crawler',
        status: 'running',
        progress: 65,
        pagesPerSecond: 12.5,
        successRate: 94.2,
        errorCount: 23,
        totalPages: 1547,
        queueSize: 892,
        cpuUsage: 45,
        memoryUsage: 67,
        bandwidth: 2.3,
        lastActivity: '2 seconds ago',
        startTime: '2024-01-15T08:30:00Z',
        targetDomain: 'example-store.com',
        configuration: {
          depth: 5,
          frequency: 'high',
          concurrent: 15,
          rateLimit: 500,
          userAgent: 'ProductBot/1.0',
          respectRobots: true,
          followRedirects: true,
          timeout: 30000
        }
      },
      {
        id: '2',
        name: 'News Article Scraper',
        status: 'paused',
        progress: 34,
        pagesPerSecond: 0,
        successRate: 89.1,
        errorCount: 45,
        totalPages: 789,
        queueSize: 456,
        cpuUsage: 0,
        memoryUsage: 23,
        bandwidth: 0,
        lastActivity: '5 minutes ago',
        startTime: '2024-01-15T09:15:00Z',
        targetDomain: 'news-site.com',
        configuration: {
          depth: 3,
          frequency: 'medium',
          concurrent: 8,
          rateLimit: 2000,
          userAgent: 'NewsBot/1.0',
          respectRobots: true,
          followRedirects: true,
          timeout: 45000
        }
      },
      {
        id: '3',
        name: 'Social Media Monitor',
        status: 'error',
        progress: 12,
        pagesPerSecond: 0,
        successRate: 76.3,
        errorCount: 128,
        totalPages: 234,
        queueSize: 1234,
        cpuUsage: 12,
        memoryUsage: 34,
        bandwidth: 0.1,
        lastActivity: '1 hour ago',
        startTime: '2024-01-15T07:45:00Z',
        targetDomain: 'social-platform.com',
        configuration: {
          depth: 2,
          frequency: 'low',
          concurrent: 5,
          rateLimit: 5000,
          userAgent: 'SocialBot/1.0',
          respectRobots: false,
          followRedirects: false,
          timeout: 60000
        }
      }
    ];

    setCrawlers(mockCrawlers);

    // Mock queue data
    const mockQueue: QueueItem[] = [
      {
        id: '1',
        url: 'https://example-store.com/products/category-1',
        priority: 'high',
        status: 'processing',
        attempts: 1,
        lastAttempt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        url: 'https://example-store.com/products/category-2',
        priority: 'medium',
        status: 'pending',
        attempts: 0,
        lastAttempt: ''
      },
      {
        id: '3',
        url: 'https://example-store.com/products/category-3',
        priority: 'low',
        status: 'failed',
        attempts: 3,
        lastAttempt: '2024-01-15T10:25:00Z'
      }
    ];

    setQueue(mockQueue);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCrawlers(prev => prev.map(crawler => {
        if (crawler.status === 'running') {
          return {
            ...crawler,
            progress: Math.min(100, crawler.progress + Math.random() * 2),
            pagesPerSecond: Math.max(0, crawler.pagesPerSecond + (Math.random() - 0.5) * 2),
            totalPages: crawler.totalPages + Math.floor(Math.random() * 5),
            queueSize: Math.max(0, crawler.queueSize - Math.floor(Math.random() * 10)),
            cpuUsage: Math.max(0, Math.min(100, crawler.cpuUsage + (Math.random() - 0.5) * 10)),
            memoryUsage: Math.max(0, Math.min(100, crawler.memoryUsage + (Math.random() - 0.5) * 5)),
            bandwidth: Math.max(0, crawler.bandwidth + (Math.random() - 0.5) * 0.5),
            lastActivity: 'Just now'
          };
        }
        return crawler;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCrawlerAction = (crawlerId: string, action: string) => {
    setCrawlers(prev => prev.map(crawler => {
      if (crawler.id === crawlerId) {
        let newStatus = crawler.status;
        switch (action) {
          case 'start':
            newStatus = 'running';
            break;
          case 'pause':
            newStatus = 'paused';
            break;
          case 'stop':
            newStatus = 'stopped';
            break;
          case 'restart':
            newStatus = 'running';
            break;
        }
        return { ...crawler, status: newStatus };
      }
      return crawler;
    }));
  };

  const handleCreateCrawler = () => {
    const newCrawlerData: CrawlerStatus = {
      id: `${Date.now()}`,
      name: newCrawler.name,
      status: 'stopped',
      progress: 0,
      pagesPerSecond: 0,
      successRate: 0,
      errorCount: 0,
      totalPages: 0,
      queueSize: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      bandwidth: 0,
      lastActivity: 'Never',
      startTime: new Date().toISOString(),
      targetDomain: newCrawler.targetDomain,
      configuration: {
        depth: newCrawler.depth,
        frequency: newCrawler.frequency,
        concurrent: newCrawler.concurrent,
        rateLimit: newCrawler.rateLimit,
        userAgent: newCrawler.userAgent,
        respectRobots: newCrawler.respectRobots,
        followRedirects: newCrawler.followRedirects,
        timeout: newCrawler.timeout
      }
    };

    setCrawlers(prev => [...prev, newCrawlerData]);
    setIsCreateModalOpen(false);
    setNewCrawler({
      name: '',
      targetDomain: '',
      depth: 3,
      frequency: 'medium',
      concurrent: 10,
      rateLimit: 1000,
      userAgent: 'CrawlerBot/1.0',
      respectRobots: true,
      followRedirects: true,
      timeout: 30000
    });
  };

  const filteredCrawlers = crawlers
    .filter(crawler => {
      const matchesSearch = crawler.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           crawler.targetDomain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || crawler.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'performance':
          return b.pagesPerSecond - a.pagesPerSecond;
        case 'lastActivity':
        default:
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
    });

  const activeCrawlers = crawlers.filter(c => c.status === 'running').length;
  const totalPages = crawlers.reduce((sum, c) => sum + c.totalPages, 0);
  const avgSuccessRate = crawlers.reduce((sum, c) => sum + c.successRate, 0) / crawlers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Crawlers</h1>
          <p className="text-gray-400 mt-1">
            {activeCrawlers} active crawler{activeCrawlers !== 1 ? 's' : ''} • {totalPages.toLocaleString()} pages crawled
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Crawler
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1d21] border-[#2a2f36] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Crawler</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#2a2f36]">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="limits">Limits</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Crawler Name</Label>
                  <Input
                    id="name"
                    value={newCrawler.name}
                    onChange={(e) => setNewCrawler(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter crawler name"
                    className="bg-[#2a2f36] border-[#3a3f46]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Target Domain</Label>
                  <Input
                    id="domain"
                    value={newCrawler.targetDomain}
                    onChange={(e) => setNewCrawler(prev => ({ ...prev, targetDomain: e.target.value }))}
                    placeholder="example.com"
                    className="bg-[#2a2f36] border-[#3a3f46]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="depth">Crawl Depth</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={newCrawler.depth}
                      onChange={(e) => setNewCrawler(prev => ({ ...prev, depth: parseInt(e.target.value) }))}
                      className="bg-[#2a2f36] border-[#3a3f46]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={newCrawler.frequency} onValueChange={(value) => setNewCrawler(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger className="bg-[#2a2f36] border-[#3a3f46]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2a2f36] border-[#3a3f46]">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userAgent">User Agent</Label>
                  <Input
                    id="userAgent"
                    value={newCrawler.userAgent}
                    onChange={(e) => setNewCrawler(prev => ({ ...prev, userAgent: e.target.value }))}
                    className="bg-[#2a2f36] border-[#3a3f46]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="concurrent">Concurrent Requests</Label>
                    <Input
                      id="concurrent"
                      type="number"
                      value={newCrawler.concurrent}
                      onChange={(e) => setNewCrawler(prev => ({ ...prev, concurrent: parseInt(e.target.value) }))}
                      className="bg-[#2a2f36] border-[#3a3f46]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={newCrawler.timeout}
                      onChange={(e) => setNewCrawler(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                      className="bg-[#2a2f36] border-[#3a3f46]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="robots">Respect robots.txt</Label>
                  <Switch
                    id="robots"
                    checked={newCrawler.respectRobots}
                    onCheckedChange={(checked) => setNewCrawler(prev => ({ ...prev, respectRobots: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="redirects">Follow redirects</Label>
                  <Switch
                    id="redirects"
                    checked={newCrawler.followRedirects}
                    onCheckedChange={(checked) => setNewCrawler(prev => ({ ...prev, followRedirects: checked }))}
                  />
                </div>
              </TabsContent>
              <TabsContent value="limits" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate Limit (ms between requests)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={newCrawler.rateLimit}
                    onChange={(e) => setNewCrawler(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                    className="bg-[#2a2f36] border-[#3a3f46]"
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="border-[#3a3f46]">
                Cancel
              </Button>
              <Button onClick={handleCreateCrawler} className="bg-teal-500 hover:bg-teal-600">
                Create Crawler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#2a2f36] border-[#3a3f46]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white flex items-center">
              <Activity className="w-4 h-4 mr-2 text-teal-400" />
              Active Crawlers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeCrawlers}</div>
            <p className="text-xs text-gray-400">
              {activeCrawlers > 0 ? 'Currently running' : 'No active crawlers'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2f36] border-[#3a3f46]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white flex items-center">
              <Database className="w-4 h-4 mr-2 text-purple-400" />
              Total Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPages.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2f36] border-[#3a3f46]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-400" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Average across all crawlers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2f36] border-[#3a3f46]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white flex items-center">
              <Timer className="w-4 h-4 mr-2 text-amber-400" />
              Queue Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {crawlers.reduce((sum, c) => sum + c.queueSize, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">
              URLs pending processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search crawlers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#2a2f36] border-[#3a3f46] text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-[#2a2f36] border-[#3a3f46] text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2f36] border-[#3a3f46]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-[#2a2f36] border-[#3a3f46] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2f36] border-[#3a3f46]">
              <SelectItem value="lastActivity">Last Activity</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Crawler Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCrawlers.map((crawler) => {
          const StatusIcon = statusConfig[crawler.status].icon;
          return (
            <Card key={crawler.id} className="bg-[#2a2f36] border-[#3a3f46] hover:border-[#4a4f56] transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${statusConfig[crawler.status].color}`} />
                    <div>
                      <CardTitle className="text-lg font-semibold text-white">{crawler.name}</CardTitle>
                      <p className="text-sm text-gray-400">{crawler.targetDomain}</p>
                    </div>
                  </div>
                  <Badge className={statusConfig[crawler.status].badge}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {crawler.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{crawler.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={crawler.progress} className="h-2" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <Zap className="w-3 h-3 mr-1" />
                      Pages/sec
                    </div>
                    <div className="text-sm font-medium text-white">{crawler.pagesPerSecond.toFixed(1)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <Target className="w-3 h-3 mr-1" />
                      Success Rate
                    </div>
                    <div className="text-sm font-medium text-white">{crawler.successRate.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <Database className="w-3 h-3 mr-1" />
                      Total Pages
                    </div>
                    <div className="text-sm font-medium text-white">{crawler.totalPages.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <Timer className="w-3 h-3 mr-1" />
                      Queue Size
                    </div>
                    <div className="text-sm font-medium text-white">{crawler.queueSize.toLocaleString()}</div>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Resources</span>
                    <span>CPU: {crawler.cpuUsage}% | MEM: {crawler.memoryUsage}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-3 h-3 text-blue-400" />
                    <Progress value={crawler.cpuUsage} className="flex-1 h-1" />
                    <HardDrive className="w-3 h-3 text-purple-400" />
                    <Progress value={crawler.memoryUsage} className="flex-1 h-1" />
                  </div>
                </div>

                <Separator className="bg-[#3a3f46]" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {crawler.status === 'running' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCrawlerAction(crawler.id, 'pause')}
                          className="border-[#3a3f46] text-white hover:bg-[#3a3f46]"
                        >
                          <Pause className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCrawlerAction(crawler.id, 'stop')}
                          className="border-[#3a3f46] text-white hover:bg-[#3a3f46]"
                        >
                          <Square className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCrawlerAction(crawler.id, 'start')}
                          className="border-teal-500 text-teal-400 hover:bg-teal-500/10"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCrawlerAction(crawler.id, 'restart')}
                          className="border-[#3a3f46] text-white hover:bg-[#3a3f46]"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedCrawler(crawler.id)}
                      className="text-gray-400 hover:text-white hover:bg-[#3a3f46]"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-[#3a3f46]"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Last activity: {crawler.lastActivity}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCrawlers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#2a2f36] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No crawlers found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first crawler'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Crawler
            </Button>
          )}
        </div>
      )}
    </div>
  );
};