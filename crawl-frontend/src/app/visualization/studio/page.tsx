"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  CuboidIcon as Cube,
  Brain,
  Eye,
  Globe,
  Sparkles,
  Play,
  Settings,
  Download,
  Share,
  Save,
  Plus,
  Layers,
  BarChart3,
  LineChart,
  PieChart,
  Network,
  Undo,
  Redo,
} from "lucide-react"
import Link from "next/link"

export default function VisualizationStudioPage() {
  const [activeTab, setActiveTab] = useState("3d")
  const [quality, setQuality] = useState([80])
  const [complexity, setComplexity] = useState([65])
  const [isRealtime, setIsRealtime] = useState(true)
  const [isAIAssisted, setIsAIAssisted] = useState(true)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Studio Header */}
      <header className="border-b border-white/10 bg-black/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/visualization" className="flex items-center space-x-2">
              <Cube className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-lg">Visualization Studio</span>
            </Link>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Beta</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-white">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Studio Layout */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-white/10 bg-black/80 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Visualization Types</h3>
          <div className="space-y-2">
            {[
              { name: "3D Data Sculptures", icon: Cube, color: "text-cyan-400" },
              { name: "Neural Networks", icon: Brain, color: "text-purple-400" },
              { name: "Holographic", icon: Eye, color: "text-emerald-400" },
              { name: "Digital Twins", icon: Globe, color: "text-orange-400" },
              { name: "Bar Charts", icon: BarChart3, color: "text-blue-400" },
              { name: "Line Charts", icon: LineChart, color: "text-green-400" },
              { name: "Pie Charts", icon: PieChart, color: "text-red-400" },
              { name: "Network Graphs", icon: Network, color: "text-yellow-400" },
            ].map((type) => (
              <div
                key={type.name}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <type.icon className={`w-5 h-5 ${type.color}`} />
                <span className="text-sm">{type.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Data Sources</h3>
            <div className="space-y-2">
              {[
                { name: "Sample Dataset", type: "CSV", size: "2.4 MB" },
                { name: "Financial Data", type: "JSON", size: "4.7 MB" },
                { name: "User Analytics", type: "API", size: "Real-time" },
                { name: "IoT Sensors", type: "Stream", size: "Live" },
                { name: "ML Model Output", type: "TensorFlow", size: "1.2 GB" },
              ].map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {source.type}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-cyan-400">
                <Plus className="w-4 h-4 mr-1" />
                Add Data Source
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-white/10 bg-black/80">
              <div className="max-w-7xl mx-auto">
                <TabsList className="bg-transparent border-b border-white/10">
                  <TabsTrigger
                    value="3d"
                    className="data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none border-b-2 border-transparent"
                  >
                    3D View
                  </TabsTrigger>
                  <TabsTrigger
                    value="data"
                    className="data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none border-b-2 border-transparent"
                  >
                    Data
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none border-b-2 border-transparent"
                  >
                    Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="export"
                    className="data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none border-b-2 border-transparent"
                  >
                    Export
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="3d" className="flex-1 p-6 overflow-auto">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center mb-6 border border-white/10">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Cube className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-xl font-medium text-white mb-2">3D Data Visualization Studio</p>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Click and drag to rotate. Scroll to zoom. Right-click to pan. Use the controls on the right to
                    customize your visualization.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">Visualization Controls</CardTitle>
                    <CardDescription className="text-gray-400">
                      Adjust parameters to customize your visualization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm text-gray-400">Rendering Quality</label>
                            <span className="text-sm text-cyan-400">{quality}%</span>
                          </div>
                          <Slider value={quality} onValueChange={setQuality} max={100} step={1} className="w-full" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm text-gray-400">Data Complexity</label>
                            <span className="text-sm text-cyan-400">{complexity}%</span>
                          </div>
                          <Slider
                            value={complexity}
                            onValueChange={setComplexity}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-400">Real-time Updates</label>
                          <Switch checked={isRealtime} onCheckedChange={setIsRealtime} />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-400">AI-Assisted Design</label>
                          <Switch checked={isAIAssisted} onCheckedChange={setIsAIAssisted} />
                        </div>
                        <div className="pt-2">
                          <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Visualization
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Layers</CardTitle>
                    <CardDescription className="text-gray-400">Manage visualization layers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: "Base Structure", type: "3D Mesh", visible: true },
                      { name: "Data Points", type: "Particles", visible: true },
                      { name: "Connections", type: "Lines", visible: true },
                      { name: "Labels", type: "Text", visible: false },
                      { name: "Highlights", type: "Glow", visible: true },
                    ].map((layer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Layers className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-white">{layer.name}</div>
                            <div className="text-xs text-gray-500">{layer.type}</div>
                          </div>
                        </div>
                        <Switch checked={layer.visible} />
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-cyan-400">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Layer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="data" className="flex-1 p-6 overflow-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Data Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure data sources and transformations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Selected Data Source</h4>
                        <select className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                          <option>Financial Data (JSON)</option>
                          <option>User Analytics (API)</option>
                          <option>IoT Sensors (Stream)</option>
                          <option>ML Model Output (TensorFlow)</option>
                        </select>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Update Frequency</h4>
                        <select className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                          <option>Real-time</option>
                          <option>Every 5 seconds</option>
                          <option>Every minute</option>
                          <option>Every 5 minutes</option>
                          <option>Manual refresh</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Data Preview</h4>
                      <div className="bg-white/5 border border-white/10 rounded-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Value
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Timestamp
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {[
                                {
                                  id: "001",
                                  value: 245.67,
                                  category: "Revenue",
                                  timestamp: "2023-06-12 14:32:45",
                                  status: "Active",
                                },
                                {
                                  id: "002",
                                  value: 128.34,
                                  category: "Expenses",
                                  timestamp: "2023-06-12 14:35:12",
                                  status: "Active",
                                },
                                {
                                  id: "003",
                                  value: 542.89,
                                  category: "Revenue",
                                  timestamp: "2023-06-12 14:40:23",
                                  status: "Pending",
                                },
                                {
                                  id: "004",
                                  value: 89.45,
                                  category: "Expenses",
                                  timestamp: "2023-06-12 14:45:56",
                                  status: "Active",
                                },
                                {
                                  id: "005",
                                  value: 367.12,
                                  category: "Revenue",
                                  timestamp: "2023-06-12 14:50:34",
                                  status: "Inactive",
                                },
                              ].map((row, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                  <td className="px-4 py-3 text-sm text-white">{row.id}</td>
                                  <td className="px-4 py-3 text-sm text-white">{row.value}</td>
                                  <td className="px-4 py-3 text-sm text-white">{row.category}</td>
                                  <td className="px-4 py-3 text-sm text-gray-400">{row.timestamp}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <Badge
                                      className={
                                        row.status === "Active"
                                          ? "bg-green-500/20 text-green-400"
                                          : row.status === "Pending"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-gray-500/20 text-gray-400"
                                      }
                                    >
                                      {row.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="bg-cyan-500 hover:bg-cyan-400">
                        <Play className="w-4 h-4 mr-2" />
                        Apply Data
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Data Transformations
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-6 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Visualization Settings</CardTitle>
                    <CardDescription className="text-gray-400">Configure appearance and behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Theme</h4>
                      <select className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                        <option>Palantir Light</option>
                        <option>Framer Dark</option>
                        <option>Neon Cyber</option>
                        <option>Minimal White</option>
                        <option>Custom Theme</option>
                      </select>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Color Palette</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"].map((color, i) => (
                          <div
                            key={i}
                            className="w-full aspect-square rounded-md border border-white/20"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400">Show Labels</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400">Show Legend</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400">Enable Animations</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400">Enable Tooltips</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400">Auto-rotate Camera</label>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Settings</CardTitle>
                    <CardDescription className="text-gray-400">Optimize for your hardware capabilities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Quality Preset</h4>
                      <select className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                        <option>Ultra (RTX 4090+)</option>
                        <option>High (RTX 3080+)</option>
                        <option>Medium (GTX 1080+)</option>
                        <option>Low (Integrated GPU)</option>
                        <option>Custom</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-gray-400">Resolution Scale</label>
                          <span className="text-sm text-cyan-400">100%</span>
                        </div>
                        <Slider defaultValue={[100]} max={200} step={5} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-gray-400">Max Data Points</label>
                          <span className="text-sm text-cyan-400">10,000</span>
                        </div>
                        <Slider defaultValue={[50]} max={100} step={5} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-gray-400">Shadow Quality</label>
                          <span className="text-sm text-cyan-400">High</span>
                        </div>
                        <Slider defaultValue={[75]} max={100} step={25} className="w-full" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="w-full bg-cyan-500 hover:bg-cyan-400">
                        <Settings className="w-4 h-4 mr-2" />
                        Apply Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="export" className="flex-1 p-6 overflow-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Export Visualization</CardTitle>
                  <CardDescription className="text-gray-400">Share or download your visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Export Format</h4>
                        <select className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                          <option>Interactive HTML (Web)</option>
                          <option>Static Image (PNG)</option>
                          <option>Video (MP4)</option>
                          <option>3D Model (GLB)</option>
                          <option>VR Experience (WebXR)</option>
                        </select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Quality Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">High Resolution</label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Include Metadata</label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Compress Output</label>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button className="flex-1 bg-cyan-500 hover:bg-cyan-400">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button className="flex-1 bg-purple-500 hover:bg-purple-400">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Preview</h4>
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center border border-white/10">
                        <div className="text-center p-4">
                          <Cube className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Export Preview</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          <Eye className="w-4 h-4 mr-2" />
                          Generate Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 border-l border-white/10 bg-black/80 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Properties</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Selected Object</h4>
              <div className="p-3 rounded-md bg-white/5 border border-white/10">
                <div className="text-sm font-medium text-white">Data Cluster #3</div>
                <div className="text-xs text-gray-400 mt-1">Type: 3D Point Group</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    defaultValue="0.0"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="1.5"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="-0.5"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    defaultValue="0"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="45"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="0"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    defaultValue="1.0"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="1.0"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    defaultValue="1.0"
                    className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Appearance</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Color</label>
                  <div className="flex space-x-2">
                    <div
                      className="w-6 h-6 rounded-md border border-white/20"
                      style={{ backgroundColor: "#3B82F6" }}
                    ></div>
                    <input
                      type="text"
                      defaultValue="#3B82F6"
                      className="flex-1 bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                  <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Size</label>
                  <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Data Mapping</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">X Axis</label>
                  <select className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs">
                    <option>Revenue</option>
                    <option>Time</option>
                    <option>Category</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Y Axis</label>
                  <select className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs">
                    <option>Profit</option>
                    <option>Count</option>
                    <option>Growth</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Z Axis</label>
                  <select className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-xs">
                    <option>Time</option>
                    <option>Region</option>
                    <option>Category</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Database(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}
