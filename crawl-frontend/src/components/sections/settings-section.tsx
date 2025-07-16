"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Settings, 
  Bot, 
  Shield, 
  Server, 
  Database, 
  Zap,
  Save,
  RotateCcw,
  Upload,
  Download,
  Bell,
  Globe,
  Key,
  Lock,
  Monitor,
  Cloud,
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsData {
  general: {
    name: string;
    email: string;
    company: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    timezone: string;
    theme: string;
  };
  crawler: {
    defaultDelay: number;
    maxConcurrent: number;
    userAgent: string;
    respectRobots: boolean;
    followRedirects: boolean;
    maxRetries: number;
    timeout: number;
    proxyEnabled: boolean;
    proxyUrl: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  infrastructure: {
    maxMemoryUsage: number;
    maxCpuUsage: number;
    maxBandwidth: number;
    storageRetention: number;
    backupEnabled: boolean;
    backupFrequency: string;
    monitoringEnabled: boolean;
  };
  dataManagement: {
    retentionPeriod: number;
    autoArchive: boolean;
    exportFormat: string;
    dataQualityChecks: boolean;
    gdprCompliance: boolean;
    encryptionEnabled: boolean;
  };
  integrations: {
    webhookUrl: string;
    apiKeys: { name: string; key: string; }[];
    cloudProvider: string;
    databaseConnection: string;
    slackIntegration: boolean;
    emailIntegration: boolean;
  };
}

const defaultSettings: SettingsData = {
  general: {
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Tech Corp",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    language: "en",
    timezone: "UTC",
    theme: "light"
  },
  crawler: {
    defaultDelay: 1000,
    maxConcurrent: 10,
    userAgent: "WebCrawler/1.0",
    respectRobots: true,
    followRedirects: true,
    maxRetries: 3,
    timeout: 30000,
    proxyEnabled: false,
    proxyUrl: ""
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },
  infrastructure: {
    maxMemoryUsage: 80,
    maxCpuUsage: 70,
    maxBandwidth: 100,
    storageRetention: 90,
    backupEnabled: true,
    backupFrequency: "daily",
    monitoringEnabled: true
  },
  dataManagement: {
    retentionPeriod: 365,
    autoArchive: true,
    exportFormat: "json",
    dataQualityChecks: true,
    gdprCompliance: true,
    encryptionEnabled: true
  },
  integrations: {
    webhookUrl: "",
    apiKeys: [],
    cloudProvider: "aws",
    databaseConnection: "postgresql://localhost:5432/crawler",
    slackIntegration: false,
    emailIntegration: true
  }
};

export const SettingsSection = () => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAlert, setShowAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleSettingChange = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedSettingChange = (section: keyof SettingsData, parentField: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasChanges(false);
      setShowAlert({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error) {
      setShowAlert({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
    setShowAlert({ type: 'info', message: 'Settings reset to defaults.' });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'crawler-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const addApiKey = () => {
    const newKey = { name: '', key: '' };
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        apiKeys: [...prev.integrations.apiKeys, newKey]
      }
    }));
    setHasChanges(true);
  };

  const removeApiKey = (index: number) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        apiKeys: prev.integrations.apiKeys.filter((_, i) => i !== index)
      }
    }));
    setHasChanges(true);
  };

  const addIpToWhitelist = () => {
    const ip = prompt('Enter IP address to whitelist:');
    if (ip) {
      setSettings(prev => ({
        ...prev,
        security: {
          ...prev.security,
          ipWhitelist: [...prev.security.ipWhitelist, ip]
        }
      }));
      setHasChanges(true);
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        ipWhitelist: prev.security.ipWhitelist.filter(item => item !== ip)
      }
    }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your crawler configuration and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <Alert className={`${
          showAlert.type === 'success' ? 'border-green-200 bg-green-50' :
          showAlert.type === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          {showAlert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
          {showAlert.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
          {showAlert.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
          <AlertDescription className={`${
            showAlert.type === 'success' ? 'text-green-800' :
            showAlert.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {showAlert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Save Progress */}
      {saving && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Saving settings...</span>
            <span>Please wait</span>
          </div>
          <Progress value={66} className="h-2" />
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="crawler" className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>Crawler</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="flex items-center space-x-2">
            <Server className="w-4 h-4" />
            <span>Infrastructure</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Data</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.general.name}
                    onChange={(e) => handleSettingChange('general', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={settings.general.company}
                  onChange={(e) => handleSettingChange('general', 'company', e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.general.notifications.email}
                      onCheckedChange={(checked) => handleNestedSettingChange('general', 'notifications', 'email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.general.notifications.push}
                      onCheckedChange={(checked) => handleNestedSettingChange('general', 'notifications', 'push', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive SMS notifications</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={settings.general.notifications.sms}
                      onCheckedChange={(checked) => handleNestedSettingChange('general', 'notifications', 'sms', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Localization</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.general.language} onValueChange={(value) => handleSettingChange('general', 'language', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.general.timezone} onValueChange={(value) => handleSettingChange('general', 'timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST</SelectItem>
                        <SelectItem value="PST">PST</SelectItem>
                        <SelectItem value="CET">CET</SelectItem>
                        <SelectItem value="JST">JST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crawler Configuration */}
        <TabsContent value="crawler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Crawler Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure default crawler behavior and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultDelay">Default Delay (ms)</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[settings.crawler.defaultDelay]}
                      onValueChange={(value) => handleSettingChange('crawler', 'defaultDelay', value[0])}
                      max={5000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0ms</span>
                      <span className="font-medium">{settings.crawler.defaultDelay}ms</span>
                      <span>5000ms</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConcurrent">Max Concurrent Requests</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[settings.crawler.maxConcurrent]}
                      onValueChange={(value) => handleSettingChange('crawler', 'maxConcurrent', value[0])}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1</span>
                      <span className="font-medium">{settings.crawler.maxConcurrent}</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userAgent">User Agent String</Label>
                <Input
                  id="userAgent"
                  value={settings.crawler.userAgent}
                  onChange={(e) => handleSettingChange('crawler', 'userAgent', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxRetries">Max Retries</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    value={settings.crawler.maxRetries}
                    onChange={(e) => handleSettingChange('crawler', 'maxRetries', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings.crawler.timeout}
                    onChange={(e) => handleSettingChange('crawler', 'timeout', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Crawler Behavior</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="respectRobots">Respect robots.txt</Label>
                      <p className="text-sm text-gray-600">Follow robots.txt directives</p>
                    </div>
                    <Switch
                      id="respectRobots"
                      checked={settings.crawler.respectRobots}
                      onCheckedChange={(checked) => handleSettingChange('crawler', 'respectRobots', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="followRedirects">Follow Redirects</Label>
                      <p className="text-sm text-gray-600">Automatically follow HTTP redirects</p>
                    </div>
                    <Switch
                      id="followRedirects"
                      checked={settings.crawler.followRedirects}
                      onCheckedChange={(checked) => handleSettingChange('crawler', 'followRedirects', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Proxy Configuration</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="proxyEnabled">Enable Proxy</Label>
                    <p className="text-sm text-gray-600">Route requests through proxy server</p>
                  </div>
                  <Switch
                    id="proxyEnabled"
                    checked={settings.crawler.proxyEnabled}
                    onCheckedChange={(checked) => handleSettingChange('crawler', 'proxyEnabled', checked)}
                  />
                </div>
                {settings.crawler.proxyEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="proxyUrl">Proxy URL</Label>
                    <Input
                      id="proxyUrl"
                      placeholder="http://proxy.example.com:8080"
                      value={settings.crawler.proxyUrl}
                      onChange={(e) => handleSettingChange('crawler', 'proxyUrl', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Authentication</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">IP Whitelist</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Allowed IP Addresses</Label>
                    <Button variant="outline" size="sm" onClick={addIpToWhitelist}>
                      <Plus className="w-4 h-4" />
                      Add IP
                    </Button>
                  </div>
                  {settings.security.ipWhitelist.length > 0 ? (
                    <div className="space-y-2">
                      {settings.security.ipWhitelist.map((ip, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-mono text-sm">{ip}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeIpFromWhitelist(ip)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No IP addresses whitelisted</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Password Policy</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    </div>
                    <Switch
                      id="requireUppercase"
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handleNestedSettingChange('security', 'passwordPolicy', 'requireUppercase', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireNumbers">Require Numbers</Label>
                    </div>
                    <Switch
                      id="requireNumbers"
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handleNestedSettingChange('security', 'passwordPolicy', 'requireNumbers', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    </div>
                    <Switch
                      id="requireSpecialChars"
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => handleNestedSettingChange('security', 'passwordPolicy', 'requireSpecialChars', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infrastructure Settings */}
        <TabsContent value="infrastructure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Infrastructure Settings</span>
              </CardTitle>
              <CardDescription>
                Configure resource limits and monitoring settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Resource Limits</span>
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxMemoryUsage">Max Memory Usage (%)</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[settings.infrastructure.maxMemoryUsage]}
                        onValueChange={(value) => handleSettingChange('infrastructure', 'maxMemoryUsage', value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>10%</span>
                        <span className="font-medium">{settings.infrastructure.maxMemoryUsage}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCpuUsage">Max CPU Usage (%)</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[settings.infrastructure.maxCpuUsage]}
                        onValueChange={(value) => handleSettingChange('infrastructure', 'maxCpuUsage', value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>10%</span>
                        <span className="font-medium">{settings.infrastructure.maxCpuUsage}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBandwidth">Max Bandwidth (Mbps)</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[settings.infrastructure.maxBandwidth]}
                        onValueChange={(value) => handleSettingChange('infrastructure', 'maxBandwidth', value[0])}
                        max={1000}
                        min={1}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>1 Mbps</span>
                        <span className="font-medium">{settings.infrastructure.maxBandwidth} Mbps</span>
                        <span>1000 Mbps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Storage</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="storageRetention">Storage Retention (days)</Label>
                    <Input
                      id="storageRetention"
                      type="number"
                      value={settings.infrastructure.storageRetention}
                      onChange={(e) => handleSettingChange('infrastructure', 'storageRetention', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Backup & Monitoring</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="backupEnabled">Enable Backups</Label>
                      <p className="text-sm text-gray-600">Automatically backup crawler data</p>
                    </div>
                    <Switch
                      id="backupEnabled"
                      checked={settings.infrastructure.backupEnabled}
                      onCheckedChange={(checked) => handleSettingChange('infrastructure', 'backupEnabled', checked)}
                    />
                  </div>
                  {settings.infrastructure.backupEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select value={settings.infrastructure.backupFrequency} onValueChange={(value) => handleSettingChange('infrastructure', 'backupFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monitoringEnabled">Enable Monitoring</Label>
                      <p className="text-sm text-gray-600">Monitor system performance</p>
                    </div>
                    <Switch
                      id="monitoringEnabled"
                      checked={settings.infrastructure.monitoringEnabled}
                      onCheckedChange={(checked) => handleSettingChange('infrastructure', 'monitoringEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>
                Configure data retention, export settings, and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Retention</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={settings.dataManagement.retentionPeriod}
                      onChange={(e) => handleSettingChange('dataManagement', 'retentionPeriod', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoArchive">Auto Archive</Label>
                      <p className="text-sm text-gray-600">Automatically archive old data</p>
                    </div>
                    <Switch
                      id="autoArchive"
                      checked={settings.dataManagement.autoArchive}
                      onCheckedChange={(checked) => handleSettingChange('dataManagement', 'autoArchive', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Export Settings</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <Select value={settings.dataManagement.exportFormat} onValueChange={(value) => handleSettingChange('dataManagement', 'exportFormat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="parquet">Parquet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Quality & Compliance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dataQualityChecks">Data Quality Checks</Label>
                      <p className="text-sm text-gray-600">Perform automatic quality validation</p>
                    </div>
                    <Switch
                      id="dataQualityChecks"
                      checked={settings.dataManagement.dataQualityChecks}
                      onCheckedChange={(checked) => handleSettingChange('dataManagement', 'dataQualityChecks', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="gdprCompliance">GDPR Compliance</Label>
                      <p className="text-sm text-gray-600">Enable GDPR compliance features</p>
                    </div>
                    <Switch
                      id="gdprCompliance"
                      checked={settings.dataManagement.gdprCompliance}
                      onCheckedChange={(checked) => handleSettingChange('dataManagement', 'gdprCompliance', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="encryptionEnabled">Data Encryption</Label>
                      <p className="text-sm text-gray-600">Encrypt stored data</p>
                    </div>
                    <Switch
                      id="encryptionEnabled"
                      checked={settings.dataManagement.encryptionEnabled}
                      onCheckedChange={(checked) => handleSettingChange('dataManagement', 'encryptionEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>
                Configure third-party integrations and API connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API Keys</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Manage API Keys</Label>
                    <Button variant="outline" size="sm" onClick={addApiKey}>
                      <Plus className="w-4 h-4" />
                      Add Key
                    </Button>
                  </div>
                  {settings.integrations.apiKeys.length > 0 ? (
                    <div className="space-y-3">
                      {settings.integrations.apiKeys.map((apiKey, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              placeholder="API Key Name"
                              value={apiKey.name}
                              onChange={(e) => {
                                const updatedKeys = [...settings.integrations.apiKeys];
                                updatedKeys[index].name = e.target.value;
                                setSettings(prev => ({
                                  ...prev,
                                  integrations: {
                                    ...prev.integrations,
                                    apiKeys: updatedKeys
                                  }
                                }));
                                setHasChanges(true);
                              }}
                            />
                            <Button variant="ghost" size="sm" onClick={() => removeApiKey(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="API Key Value"
                              value={apiKey.key}
                              onChange={(e) => {
                                const updatedKeys = [...settings.integrations.apiKeys];
                                updatedKeys[index].key = e.target.value;
                                setSettings(prev => ({
                                  ...prev,
                                  integrations: {
                                    ...prev.integrations,
                                    apiKeys: updatedKeys
                                  }
                                }));
                                setHasChanges(true);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No API keys configured</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Webhooks</h3>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://api.example.com/webhook"
                    value={settings.integrations.webhookUrl}
                    onChange={(e) => handleSettingChange('integrations', 'webhookUrl', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Cloud className="w-5 h-5" />
                  <span>Cloud Services</span>
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cloudProvider">Cloud Provider</Label>
                    <Select value={settings.integrations.cloudProvider} onValueChange={(value) => handleSettingChange('integrations', 'cloudProvider', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">Amazon Web Services</SelectItem>
                        <SelectItem value="azure">Microsoft Azure</SelectItem>
                        <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                        <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="databaseConnection">Database Connection</Label>
                    <Textarea
                      id="databaseConnection"
                      placeholder="Database connection string"
                      value={settings.integrations.databaseConnection}
                      onChange={(e) => handleSettingChange('integrations', 'databaseConnection', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">External Services</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="slackIntegration">Slack Integration</Label>
                      <p className="text-sm text-gray-600">Send notifications to Slack</p>
                    </div>
                    <Switch
                      id="slackIntegration"
                      checked={settings.integrations.slackIntegration}
                      onCheckedChange={(checked) => handleSettingChange('integrations', 'slackIntegration', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailIntegration">Email Integration</Label>
                      <p className="text-sm text-gray-600">Send email notifications</p>
                    </div>
                    <Switch
                      id="emailIntegration"
                      checked={settings.integrations.emailIntegration}
                      onCheckedChange={(checked) => handleSettingChange('integrations', 'emailIntegration', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-3">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">You have unsaved changes</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};