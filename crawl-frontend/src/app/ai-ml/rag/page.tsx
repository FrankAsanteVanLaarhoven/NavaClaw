"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  FileText,
  Search,
  MessageSquare,
  Brain,
  Zap,
  Settings,
  Play,
  Code,
  ArrowRight,
  Sparkles,
  Download,
  Share,
} from "lucide-react"

export default function RAGPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [queryText, setQueryText] = useState("What are the key financial metrics for Q2 2023?")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              Advanced AI Technology
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Retrieval-Augmented Generation
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Enhance AI responses with intelligent document retrieval and context injection. RAG systems combine the
              power of large language models with your organization's proprietary data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400"
              >
                <Play className="w-5 h-5 mr-2" />
                Try RAG Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Code className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="architecture" className="data-[state=active]:bg-emerald-500/20">
                Architecture
              </TabsTrigger>
              <TabsTrigger value="demo" className="data-[state=active]:bg-emerald-500/20">
                Interactive Demo
              </TabsTrigger>
              <TabsTrigger value="implementation" className="data-[state=active]:bg-emerald-500/20">
                Implementation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">What is RAG?</CardTitle>
                      <CardDescription className="text-gray-400">
                        Understanding Retrieval-Augmented Generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-300">
                        Retrieval-Augmented Generation (RAG) is an AI framework that enhances large language models by
                        retrieving relevant information from external knowledge sources before generating responses.
                        This approach combines the strengths of retrieval-based and generation-based AI systems.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Key Benefits</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Access to up-to-date and proprietary information beyond training data
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Reduced hallucinations and improved factual accuracy
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Ability to cite sources and provide evidence for generated content
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Customizable knowledge base that can be updated in real-time
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Use Cases</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-cyan-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Enterprise knowledge bases and internal documentation search
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-cyan-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Customer support systems with access to product documentation
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-cyan-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Research assistants that can cite academic papers and sources
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Zap className="w-5 h-5 text-cyan-400 mr-2 shrink-0 mt-0.5" />
                              <span className="text-gray-300">
                                Legal and compliance systems with access to regulations and case law
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="font-medium text-white mb-4">How RAG Works</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                                <span className="text-emerald-400 font-bold">1</span>
                              </div>
                              <h5 className="font-medium text-white">Document Indexing</h5>
                            </div>
                            <p className="text-sm text-gray-400">
                              Documents are processed, chunked, and embedded into vector representations for efficient
                              semantic search.
                            </p>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                                <span className="text-emerald-400 font-bold">2</span>
                              </div>
                              <h5 className="font-medium text-white">Retrieval</h5>
                            </div>
                            <p className="text-sm text-gray-400">
                              When a query is received, the system retrieves the most relevant documents or passages
                              using semantic search.
                            </p>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                                <span className="text-emerald-400 font-bold">3</span>
                              </div>
                              <h5 className="font-medium text-white">Generation</h5>
                            </div>
                            <p className="text-sm text-gray-400">
                              The retrieved context is combined with the original query and sent to the LLM to generate
                              an informed response.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-white/5 border-white/10 mb-8">
                    <CardHeader>
                      <CardTitle className="text-white">RAG Performance</CardTitle>
                      <CardDescription className="text-gray-400">Metrics compared to standard LLMs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">Factual Accuracy</span>
                            <div className="flex items-center">
                              <span className="text-sm text-emerald-400 mr-2">+42%</span>
                              <span className="text-sm text-white">97%</span>
                            </div>
                          </div>
                          <Progress value={97} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">Hallucination Reduction</span>
                            <div className="flex items-center">
                              <span className="text-sm text-emerald-400 mr-2">+68%</span>
                              <span className="text-sm text-white">92%</span>
                            </div>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">Source Citation</span>
                            <div className="flex items-center">
                              <span className="text-sm text-emerald-400 mr-2">+95%</span>
                              <span className="text-sm text-white">99%</span>
                            </div>
                          </div>
                          <Progress value={99} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">Response Latency</span>
                            <div className="flex items-center">
                              <span className="text-sm text-yellow-400 mr-2">+120ms</span>
                              <span className="text-sm text-white">320ms</span>
                            </div>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Supported Models</CardTitle>
                      <CardDescription className="text-gray-400">Compatible language models</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "GPT-4 Turbo", status: "Optimized" },
                          { name: "Claude 3 Opus", status: "Optimized" },
                          { name: "LLaMA 2", status: "Supported" },
                          { name: "Mistral 7B", status: "Supported" },
                          { name: "PaLM 2", status: "Compatible" },
                        ].map((model, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <Brain className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{model.name}</span>
                            </div>
                            <Badge
                              className={
                                model.status === "Optimized"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : model.status === "Supported"
                                    ? "bg-cyan-500/20 text-cyan-400"
                                    : "bg-gray-500/20 text-gray-400"
                              }
                            >
                              {model.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="mt-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">RAG System Architecture</CardTitle>
                  <CardDescription className="text-gray-400">
                    Detailed overview of the RAG system components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-xl font-medium text-white mb-6">RAG Pipeline Architecture</h3>
                      <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Document Processing */}
                          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 rounded-lg border border-emerald-500/20">
                            <div className="flex items-center mb-3">
                              <FileText className="w-5 h-5 text-emerald-400 mr-2" />
                              <h4 className="font-medium text-white">Document Processing</h4>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                              <li>• Document loading</li>
                              <li>• Text extraction</li>
                              <li>• Chunking</li>
                              <li>• Metadata extraction</li>
                            </ul>
                          </div>

                          {/* Vector Database */}
                          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 p-4 rounded-lg border border-cyan-500/20">
                            <div className="flex items-center mb-3">
                              <Database className="w-5 h-5 text-cyan-400 mr-2" />
                              <h4 className="font-medium text-white">Vector Database</h4>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                              <li>• Embedding generation</li>
                              <li>• Vector storage</li>
                              <li>• Indexing</li>
                              <li>• Similarity search</li>
                            </ul>
                          </div>

                          {/* Retrieval Engine */}
                          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-lg border border-purple-500/20">
                            <div className="flex items-center mb-3">
                              <Search className="w-5 h-5 text-purple-400 mr-2" />
                              <h4 className="font-medium text-white">Retrieval Engine</h4>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                              <li>• Query processing</li>
                              <li>• Semantic search</li>
                              <li>• Relevance ranking</li>
                              <li>• Context selection</li>
                            </ul>
                          </div>

                          {/* Generation Engine */}
                          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 p-4 rounded-lg border border-pink-500/20">
                            <div className="flex items-center mb-3">
                              <MessageSquare className="w-5 h-5 text-pink-400 mr-2" />
                              <h4 className="font-medium text-white">Generation Engine</h4>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                              <li>• Context injection</li>
                              <li>• Prompt engineering</li>
                              <li>• Response generation</li>
                              <li>• Citation formatting</li>
                            </ul>
                          </div>
                        </div>

                        {/* Flow Arrows */}
                        <div className="hidden md:block">
                          <div className="absolute top-1/2 left-[23%] transform -translate-y-1/2">
                            <ArrowRight className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div className="absolute top-1/2 left-[48%] transform -translate-y-1/2">
                            <ArrowRight className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="absolute top-1/2 left-[73%] transform -translate-y-1/2">
                            <ArrowRight className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-4">Document Processing</h3>
                        <div className="space-y-4">
                          <p className="text-gray-300">
                            The document processing pipeline converts raw documents into a format suitable for
                            retrieval. This involves several key steps:
                          </p>
                          <div className="space-y-3">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Document Loading</h4>
                              <p className="text-sm text-gray-400">
                                Support for multiple file formats including PDF, DOCX, TXT, HTML, and Markdown.
                                Connectors for databases, APIs, and web scraping.
                              </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Text Extraction</h4>
                              <p className="text-sm text-gray-400">
                                OCR for images and scanned documents. HTML parsing for web content. Table extraction for
                                structured data.
                              </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Chunking Strategies</h4>
                              <p className="text-sm text-gray-400">
                                Semantic chunking based on content. Fixed-size chunking with overlap. Hierarchical
                                chunking for nested documents.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-medium text-white mb-4">Vector Database</h3>
                        <div className="space-y-4">
                          <p className="text-gray-300">
                            The vector database stores and indexes document embeddings for efficient retrieval. Our
                            system supports multiple vector database options:
                          </p>
                          <div className="space-y-3">
                            {[
                              {
                                name: "Pinecone",
                                description:
                                  "Managed vector database with high performance and scalability. Supports real-time updates and filtering.",
                                status: "Optimized",
                              },
                              {
                                name: "Weaviate",
                                description:
                                  "Open-source vector search engine with GraphQL API. Supports multi-modal data and hybrid search.",
                                status: "Supported",
                              },
                              {
                                name: "Milvus",
                                description:
                                  "Open-source vector database for massive-scale similarity search. Supports complex queries and filtering.",
                                status: "Supported",
                              },
                              {
                                name: "Faiss",
                                description:
                                  "Facebook AI's similarity search library. Highly efficient for large-scale vector search.",
                                status: "Compatible",
                              },
                            ].map((db, index) => (
                              <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-white">{db.name}</h4>
                                  <Badge
                                    className={
                                      db.status === "Optimized"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : db.status === "Supported"
                                          ? "bg-cyan-500/20 text-cyan-400"
                                          : "bg-gray-500/20 text-gray-400"
                                    }
                                  >
                                    {db.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-400">{db.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-4">Retrieval Engine</h3>
                        <div className="space-y-4">
                          <p className="text-gray-300">
                            The retrieval engine is responsible for finding the most relevant documents for a given
                            query. Our system implements several advanced retrieval techniques:
                          </p>
                          <div className="space-y-3">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Semantic Search</h4>
                              <p className="text-sm text-gray-400">
                                Uses dense vector embeddings to find semantically similar content, not just keyword
                                matches. Supports multiple embedding models including OpenAI, Cohere, and BERT.
                              </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Hybrid Search</h4>
                              <p className="text-sm text-gray-400">
                                Combines semantic search with traditional BM25 keyword search for improved accuracy.
                                Configurable weighting between semantic and keyword results.
                              </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Re-ranking</h4>
                              <p className="text-sm text-gray-400">
                                Uses a secondary model to re-rank initial search results for improved relevance.
                                Supports cross-encoders for high-precision ranking.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-medium text-white mb-4">Generation Engine</h3>
                        <div className="space-y-4">
                          <p className="text-gray-300">
                            The generation engine combines retrieved context with the user query to produce accurate,
                            informative responses:
                          </p>
                          <div className="space-y-3">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Context Injection</h4>
                              <p className="text-sm text-gray-400">
                                Intelligently formats retrieved documents and injects them into the prompt. Handles
                                context window limitations with smart truncation and summarization.
                              </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Prompt Engineering</h4>
                              <p className="text-sm text-gray-400">
                                Optimized prompts that instruct the model to use the provided context. System prompts
                                that encourage citation and discourage hallucination.
                              </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <h4 className="font-medium text-white mb-1">Citation Generation</h4>
                              <p className="text-sm text-gray-400">
                                Automatically generates citations for information sources. Supports multiple citation
                                formats and links back to original documents.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Interactive RAG Demo</CardTitle>
                      <CardDescription className="text-gray-400">
                        Try our RAG system with your own queries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h4 className="font-medium text-white mb-3">Knowledge Base</h4>
                          <div className="flex items-center space-x-3 mb-4">
                            <select className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white flex-1">
                              <option>Financial Reports (2020-2023)</option>
                              <option>Product Documentation</option>
                              <option>Research Papers</option>
                              <option>Legal Documents</option>
                              <option>Custom Knowledge Base</option>
                            </select>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="bg-white/10 rounded-md p-2 text-center">
                              <div className="text-2xl font-bold text-emerald-400">127</div>
                              <div className="text-xs text-gray-400">Documents</div>
                            </div>
                            <div className="bg-white/10 rounded-md p-2 text-center">
                              <div className="text-2xl font-bold text-cyan-400">1.2M</div>
                              <div className="text-xs text-gray-400">Tokens</div>
                            </div>
                            <div className="bg-white/10 rounded-md p-2 text-center">
                              <div className="text-2xl font-bold text-purple-400">4,328</div>
                              <div className="text-xs text-gray-400">Chunks</div>
                            </div>
                            <div className="bg-white/10 rounded-md p-2 text-center">
                              <div className="text-2xl font-bold text-pink-400">98.2%</div>
                              <div className="text-xs text-gray-400">Accuracy</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium text-white">Ask a Question</h4>
                            <div className="flex items-center space-x-2">
                              <select className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white text-sm">
                                <option>GPT-4 Turbo</option>
                                <option>Claude 3 Opus</option>
                                <option>LLaMA 2</option>
                                <option>Mistral 7B</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <input
                              type="text"
                              value={queryText}
                              onChange={(e) => setQueryText(e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                              placeholder="Enter your question..."
                            />
                            <Button className="bg-emerald-500 hover:bg-emerald-400">
                              <Search className="w-4 h-4 mr-2" />
                              Search
                            </Button>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-white">Response</h4>
                            <Badge className="bg-emerald-500/20 text-emerald-400">RAG-Enhanced</Badge>
                          </div>
                          <div className="space-y-4">
                            <div className="text-gray-300">
                              <p>Based on the financial reports for Q2 2023, the key financial metrics are:</p>
                              <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                  <strong className="text-white">Revenue:</strong> $2.45 billion, up 28% year-over-year
                                  (Source: Q2 2023 Earnings Report, p.3)
                                </li>
                                <li>
                                  <strong className="text-white">Gross Margin:</strong> 68.2%, an increase of 2.1
                                  percentage points from Q2 2022 (Source: Q2 2023 Financial Statements, p.7)
                                </li>
                                <li>
                                  <strong className="text-white">Operating Income:</strong> $624 million, representing
                                  25.5% of revenue (Source: Q2 2023 Earnings Report, p.4)
                                </li>
                                <li>
                                  <strong className="text-white">Net Income:</strong> $498 million, a 32% increase from
                                  Q2 2022 (Source: Q2 2023 Financial Statements, p.8)
                                </li>
                                <li>
                                  <strong className="text-white">Earnings Per Share (EPS):</strong> $1.24, exceeding
                                  analyst expectations of $1.18 (Source: Q2 2023 Earnings Call Transcript, p.2)
                                </li>
                                <li>
                                  <strong className="text-white">Free Cash Flow:</strong> $578 million, representing a
                                  23.6% margin (Source: Q2 2023 Cash Flow Statement, p.12)
                                </li>
                              </ul>
                              <p className="mt-3">
                                Additionally, the company reported strong performance in its cloud services division,
                                which grew 42% year-over-year and now represents 38% of total revenue. (Source: Q2 2023
                                Segment Analysis, p.15)
                              </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-md p-3">
                              <h5 className="text-sm font-medium text-white mb-2">Sources</h5>
                              <div className="space-y-2 text-xs">
                                <div className="flex items-start">
                                  <FileText className="w-3 h-3 text-emerald-400 mr-2 mt-0.5" />
                                  <span className="text-gray-400">
                                    Q2 2023 Earnings Report (June 30, 2023) - Pages 3, 4
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <FileText className="w-3 h-3 text-emerald-400 mr-2 mt-0.5" />
                                  <span className="text-gray-400">Q2 2023 Financial Statements - Pages 7, 8</span>
                                </div>
                                <div className="flex items-start">
                                  <FileText className="w-3 h-3 text-emerald-400 mr-2 mt-0.5" />
                                  <span className="text-gray-400">Q2 2023 Cash Flow Statement - Page 12</span>
                                </div>
                                <div className="flex items-start">
                                  <FileText className="w-3 h-3 text-emerald-400 mr-2 mt-0.5" />
                                  <span className="text-gray-400">Q2 2023 Segment Analysis - Page 15</span>
                                </div>
                                <div className="flex items-start">
                                  <FileText className="w-3 h-3 text-emerald-400 mr-2 mt-0.5" />
                                  <span className="text-gray-400">Q2 2023 Earnings Call Transcript - Page 2</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </Button>
                              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                              <Button className="bg-emerald-500 hover:bg-emerald-400 ml-auto">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Follow-up
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-white/5 border-white/10 mb-8">
                    <CardHeader>
                      <CardTitle className="text-white">Retrieved Context</CardTitle>
                      <CardDescription className="text-gray-400">
                        Documents used to generate the response
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            title: "Q2 2023 Earnings Report",
                            excerpt:
                              "...reported revenue of $2.45 billion for Q2 2023, representing a 28% increase year-over-year. Operating income was $624 million, or 25.5% of revenue...",
                            relevance: 98,
                          },
                          {
                            title: "Q2 2023 Financial Statements",
                            excerpt:
                              "...gross margin improved to 68.2%, up 2.1 percentage points from Q2 2022. Net income reached $498 million, a 32% increase compared to the same period last year...",
                            relevance: 95,
                          },
                          {
                            title: "Q2 2023 Cash Flow Statement",
                            excerpt:
                              "...generated free cash flow of $578 million during the quarter, representing a margin of 23.6%. Capital expenditures were $187 million...",
                            relevance: 92,
                          },
                          {
                            title: "Q2 2023 Segment Analysis",
                            excerpt:
                              "...cloud services division continued its strong growth trajectory, with revenue increasing 42% year-over-year. This segment now represents 38% of total company revenue...",
                            relevance: 89,
                          },
                          {
                            title: "Q2 2023 Earnings Call Transcript",
                            excerpt:
                              "...I'm pleased to announce that our EPS of $1.24 exceeded analyst expectations of $1.18, demonstrating the strength of our business model and execution...",
                            relevance: 85,
                          },
                        ].map((doc, index) => (
                          <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-md p-3 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-white">{doc.title}</h5>
                              <Badge className="bg-emerald-500/20 text-emerald-400">{doc.relevance}%</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{doc.excerpt}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto"
                            >
                              View full document
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                      <CardDescription className="text-gray-400">Query processing statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-md p-3 text-center">
                            <div className="text-2xl font-bold text-emerald-400">312ms</div>
                            <div className="text-xs text-gray-400">Retrieval Time</div>
                          </div>
                          <div className="bg-white/5 rounded-md p-3 text-center">
                            <div className="text-2xl font-bold text-cyan-400">1.8s</div>
                            <div className="text-xs text-gray-400">Generation Time</div>
                          </div>
                          <div className="bg-white/5 rounded-md p-3 text-center">
                            <div className="text-2xl font-bold text-purple-400">5</div>
                            <div className="text-xs text-gray-400">Documents Retrieved</div>
                          </div>
                          <div className="bg-white/5 rounded-md p-3 text-center">
                            <div className="text-2xl font-bold text-pink-400">98.2%</div>
                            <div className="text-xs text-gray-400">Confidence Score</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Query Analysis</h4>
                          <div className="bg-white/5 border border-white/10 rounded-md p-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Original Query</span>
                                <span className="text-white">What are the key financial metrics for Q2 2023?</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Detected Intent</span>
                                <span className="text-white">Financial Information Retrieval</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Time Period</span>
                                <span className="text-white">Q2 2023</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Entity Recognition</span>
                                <span className="text-white">Financial Metrics, Q2 2023</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Model Parameters</h4>
                          <div className="bg-white/5 border border-white/10 rounded-md p-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Temperature</span>
                                <span className="text-white">0.2</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Top-k</span>
                                <span className="text-white">5</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Max Tokens</span>
                                <span className="text-white">1,024</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Context Window</span>
                                <span className="text-white">8,192 tokens</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="mt-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Implementation Guide</CardTitle>
                  <CardDescription className="text-gray-400">
                    Step-by-step instructions for implementing RAG in your applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <span className="text-emerald-400 font-bold">1</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Document Preparation</h3>
                        <p className="text-gray-400 mb-4">
                          Prepare your documents and knowledge base for ingestion into the RAG system.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Collect and organize your documents</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Clean and preprocess text content</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Define metadata schema for documents</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <span className="text-emerald-400 font-bold">2</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Vector Database Setup</h3>
                        <p className="text-gray-400 mb-4">
                          Set up and configure your vector database for document storage and retrieval.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Choose a vector database provider</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Configure indexes and collections</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Set up authentication and security</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <span className="text-emerald-400 font-bold">3</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Document Ingestion</h3>
                        <p className="text-gray-400 mb-4">
                          Process and ingest your documents into the vector database.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Chunk documents into manageable segments</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Generate embeddings for each chunk</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Upload chunks and embeddings to database</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <span className="text-emerald-400 font-bold">4</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Retrieval Setup</h3>
                        <p className="text-gray-400 mb-4">
                          Configure the retrieval component to find relevant documents for queries.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Implement query processing logic</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Configure similarity search parameters</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Set up metadata filtering capabilities</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <span className="text-emerald-400 font-bold">5</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">LLM Integration</h3>
                        <p className="text-gray-400 mb-4">
                          Connect your retrieval system to a large language model for response generation.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Select and configure an LLM provider</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Design effective prompt templates</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Implement context injection strategies</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                          <span className="text-emerald-400 font-bold">6</span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">API Development</h3>
                        <p className="text-gray-400 mb-4">
                          Build an API layer to expose your RAG system to applications.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Design RESTful or GraphQL API endpoints</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Implement authentication and rate limiting</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                            <span>Add monitoring and logging capabilities</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-xl font-medium text-white mb-4">Code Implementation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-medium text-white mb-3">Document Processing</h4>
                          <div className="bg-white/10 rounded-md p-4">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>
                                {`import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Load document content
const text = fs.readFileSync('financial_report.pdf', 'utf8');

// Create text splitter
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Split text into chunks
const docs = await textSplitter.createDocuments([text], [
  { source: 'financial_report.pdf', date: '2023-06-30' },
]);

console.log(\`Created \${docs.length} chunks of text\`);`}
                              </code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-white mb-3">Vector Storage</h4>
                          <div className="bg-white/10 rounded-md p-4">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>
                                {`import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new PineconeClient();
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

// Create embeddings
const embeddings = new OpenAIEmbeddings();

// Store documents in Pinecone
await PineconeStore.fromDocuments(docs, embeddings, {
  pineconeIndex,
  namespace: 'financial_reports',
});

console.log('Documents stored in Pinecone');`}
                              </code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-white mb-3">Retrieval and Generation</h4>
                          <div className="bg-white/10 rounded-md p-4">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>
                                {`import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain } from 'langchain/chains';

// Initialize vector store for retrieval
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  namespace: 'financial_reports',
});

// Create retriever
const retriever = vectorStore.asRetriever({
  searchType: 'similarity',
  k: 5,
});

// Initialize LLM
const model = new OpenAI({
  temperature: 0.2,
  modelName: 'gpt-4',
});

// Create chain
const chain = RetrievalQAChain.fromLLM(model, retriever, {
  returnSourceDocuments: true,
});

// Execute query
const response = await chain.call({
  query: 'What are the key financial metrics for Q2 2023?',
});

console.log('Answer:', response.text);
console.log('Sources:', response.sourceDocuments);`}
                              </code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-white mb-3">API Endpoint</h4>
                          <div className="bg-white/10 rounded-md p-4">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>
                                {`import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// RAG query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query, namespace = 'financial_reports' } = req.body;
    
    // Initialize vector store for the specified namespace
    const vectorStore = await PineconeStore.fromExistingIndex(
      embeddings,
      {
        pineconeIndex,
        namespace,
      }
    );
    
    const retriever = vectorStore.asRetriever({ k: 5 });
    const chain = RetrievalQAChain.fromLLM(model, retriever, {
      returnSourceDocuments: true,
    });
    
    // Execute query
    const response = await chain.call({ query });
    
    // Format sources for citation
    const sources = response.sourceDocuments.map(doc => ({
      title: doc.metadata.source,
      date: doc.metadata.date,
      excerpt: doc.pageContent.substring(0, 200) + '...',
    }));
    
    res.json({
      answer: response.text,
      sources,
    });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

app.listen(3000, () => {
  console.log('RAG API server running on port 3000');
});`}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-4">Best Practices</h3>
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-md p-4">
                            <h4 className="font-medium text-white mb-2">Document Processing</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Use semantic chunking instead of fixed-size chunking when possible for more coherent
                                  document segments.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Include rich metadata with each chunk to enable filtering and improve retrieval
                                  relevance.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Implement document refresh strategies to keep your knowledge base up-to-date.
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-md p-4">
                            <h4 className="font-medium text-white mb-2">Retrieval Optimization</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Use hybrid search (combining semantic and keyword search) for improved retrieval
                                  accuracy.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Implement query expansion techniques to handle different phrasings of the same
                                  question.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Use a re-ranking step after initial retrieval to improve the relevance of results.
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-md p-4">
                            <h4 className="font-medium text-white mb-2">Prompt Engineering</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Use clear instructions in system prompts to guide the model on how to use the
                                  retrieved context.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Include explicit instructions for citation and attribution of information sources.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Test different prompt formats to find the optimal structure for your specific use
                                  case.
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-medium text-white mb-4">Advanced Techniques</h3>
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-md p-4">
                            <h4 className="font-medium text-white mb-2">Multi-stage Retrieval</h4>
                            <p className="text-sm text-gray-300 mb-3">
                              Implement a multi-stage retrieval process to improve accuracy and reduce hallucinations:
                            </p>
                            <ol className="space-y-2 text-sm text-gray-300 list-decimal pl-5">
                              <li>Initial broad retrieval to gather potentially relevant documents</li>
                              <li>Query decomposition to break complex queries into simpler sub-queries</li>
                              <li>Targeted retrieval for each sub-query to gather specific information</li>
                              <li>Re-ranking of all retrieved documents based on relevance to the original query</li>
                              <li>Synthesis of information from multiple sources into a coherent response</li>
                            </ol>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-md p-4">
                            <h4 className="font-medium text-white mb-2">Conversational Memory</h4>
                            <p className="text-sm text-gray-300 mb-3">
                              Enhance your RAG system with conversational memory to handle follow-up questions and
                              maintain context:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Implement conversation history tracking to maintain context across multiple turns
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>Use summarization techniques to condense long conversation histories</span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Implement coreference resolution to handle pronouns and references to previous
                                  questions
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-md p-4">
                            <h4 className="font-medium text-white mb-2">Evaluation and Monitoring</h4>
                            <p className="text-sm text-gray-300 mb-3">
                              Implement robust evaluation and monitoring systems to ensure RAG quality:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-300">
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>
                                  Create a test suite with ground truth answers to evaluate retrieval and generation
                                  quality
                                </span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>Implement automated evaluation metrics like ROUGE, BLEU, or BERTScore</span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>Set up monitoring for hallucination detection and factual accuracy</span>
                              </li>
                              <li className="flex items-start">
                                <Zap className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                                <span>Collect user feedback to continuously improve system performance</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Complete Implementation Guide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
