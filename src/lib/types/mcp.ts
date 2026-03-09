/**
 * Iron Cloud Nexus AI - MCP Type Definitions
 * TypeScript types for advanced MCP server integration
 */

// Agent Types Enum
export enum AgentType {
  // Core Crawling Agents (4)
  LINKEDIN_INTELLIGENCE = "linkedin_intelligence",
  WEB_SCRAPING_MASTER = "web_scraping_master",
  DATA_EXTRACTION_EXPERT = "data_extraction_expert",
  CONTENT_ANALYSIS_SPECIALIST = "content_analysis_specialist",
  
  // Platform Specialists (8)
  SALES_NAVIGATOR_AGENT = "sales_navigator_agent",
  RECRUITER_API_AGENT = "recruiter_api_agent",
  MARKETING_API_AGENT = "marketing_api_agent",
  GOOGLE_ANALYTICS_AGENT = "google_analytics_agent",
  FACEBOOK_INSIGHTS_AGENT = "facebook_insights_agent",
  TWITTER_INTELLIGENCE_AGENT = "twitter_intelligence_agent",
  INSTAGRAM_ANALYTICS_AGENT = "instagram_analytics_agent",
  YOUTUBE_PERFORMANCE_AGENT = "youtube_performance_agent",
  
  // Domain Intelligence Agents (12)
  FINANCIAL_ANALYST_AGENT = "financial_analyst_agent",
  MARKET_RESEARCH_AGENT = "market_research_agent",
  COMPETITIVE_INTELLIGENCE_AGENT = "competitive_intelligence_agent",
  TECHNICAL_ANALYSIS_AGENT = "technical_analysis_agent",
  SENTIMENT_ANALYSIS_AGENT = "sentiment_analysis_agent",
  TREND_PREDICTION_AGENT = "trend_prediction_agent",
  RISK_ASSESSMENT_AGENT = "risk_assessment_agent",
  COMPLIANCE_MONITOR_AGENT = "compliance_monitor_agent",
  SECURITY_AUDIT_AGENT = "security_audit_agent",
  PERFORMANCE_OPTIMIZATION_AGENT = "performance_optimization_agent",
  COST_OPTIMIZATION_AGENT = "cost_optimization_agent",
  QUALITY_ASSURANCE_AGENT = "quality_assurance_agent",
  
  // Autonomous Operation Agent
  ORCHESTRATION_MASTER = "orchestration_master"
}

// Security Levels Enum
export enum SecurityLevel {
  BASIC = "basic",           // SOC 2, HIPAA (Lindy level)
  ENHANCED = "enhanced",     // FIPS 140-2 Level 2
  MILITARY = "military",     // FIPS 140-2 Level 4, EAL7
  QUANTUM_SAFE = "quantum_safe"  // Post-quantum cryptography
}

// MCP Message Types
export enum MCPMessageType {
  REQUEST = "request",
  RESPONSE = "response",
  NOTIFICATION = "notification",
  ERROR = "error"
}

// MCP Resource Types
export enum MCPResourceType {
  FILE = "file",
  DATABASE = "database",
  API = "api",
  AGENT = "agent",
  INTELLIGENCE = "intelligence",
  SECURITY = "security"
}

// Agent Configuration Interface
export interface AgentConfig {
  agentType: AgentType;
  securityLevel: SecurityLevel;
  maxConcurrentTasks: number;
  timeoutSeconds: number;
  retryAttempts: number;
  successThreshold: number;
  costPerRequest: number;
  capabilities: string[];
  dependencies: AgentType[];
  apiKeysRequired: string[];
  rateLimits: Record<string, number>;
}

// Agent Result Interface
export interface AgentResult {
  agentType: AgentType;
  success: boolean;
  data: any;
  metadata: Record<string, any>;
  executionTime: number;
  costIncurred: number;
  securityAuditTrail: string[];
  qualityScore: number;
}

// MCP Message Interface
export interface MCPMessage {
  id: string;
  method: string;
  params?: Record<string, any>;
  result?: any;
  error?: Record<string, any>;
  messageType: MCPMessageType;
}

// MCP Response Interface
export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
  executionTime?: number;
  securityAuditTrail?: string[];
}

// Intelligence Request Interface
export interface IntelligenceRequest {
  query: Record<string, any>;
  targetAgents?: string[];
  priority?: 'low' | 'normal' | 'high' | 'critical';
  timeout?: number;
}

// Intelligence Response Interface
export interface IntelligenceResponse {
  success: boolean;
  data?: Record<string, any>;
  agentsUsed: string[];
  executionTime: number;
  costOptimization: string;
  securityLevel: string;
  qualityScore: number;
}

// Agent Execution Request Interface
export interface AgentExecutionRequest {
  agentType: string;
  arguments: Record<string, any>;
  securityLevel?: SecurityLevel;
}

// Agent Execution Response Interface
export interface AgentExecutionResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
  executionTime: number;
  securityAuditTrail: string[];
}

// Security Audit Request Interface
export interface SecurityAuditRequest {
  auditType: 'basic' | 'comprehensive' | 'military';
  target?: string;
  complianceStandards?: string[];
}

// Security Audit Response Interface
export interface SecurityAuditResponse {
  securityLevel: string;
  encryptionStatus: string;
  complianceStandards: string[];
  vulnerabilities: string[];
  recommendations: string[];
  auditTrailLength: number;
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  agentMetrics?: Record<string, any>;
  mcpMetrics?: Record<string, any>;
  securityMetrics?: Record<string, any>;
}

// MCP Client Configuration Interface
export interface MCPClientConfig {
  baseUrl: string;
  apiKey?: string;
  securityLevel: SecurityLevel;
  timeout: number;
  retryAttempts: number;
}

// Tool Definition Interface
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  capabilities: string[];
  securityLevel: SecurityLevel;
}

// Resource Definition Interface
export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  size?: number;
  lastModified?: string;
  securityLevel: SecurityLevel;
}

// Agent Status Interface
export interface AgentStatus {
  name: string;
  description: string;
  capabilities: string[];
  securityLevel: string;
  successRate: number;
  totalCost: number;
  status: 'active' | 'inactive' | 'error';
  lastExecution?: string;
  executionCount: number;
  successCount: number;
}

// Batch Execution Request Interface
export interface BatchExecutionRequest {
  agents: Array<{
    agent: string;
    arguments: Record<string, any>;
  }>;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  timeout?: number;
}

// Batch Execution Response Interface
export interface BatchExecutionResponse {
  batchId: string;
  totalAgents: number;
  successfulExecutions: number;
  failedExecutions: number;
  results: Array<{
    agent: string;
    success: boolean;
    data?: any;
    error?: string;
    metadata?: Record<string, any>;
  }>;
  totalExecutionTime: number;
  averageExecutionTime: number;
}

// Health Check Response Interface
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  securityLevel: string;
  activeAgents: number;
  databaseStatus: 'connected' | 'disconnected' | 'error';
  redisStatus: 'connected' | 'disconnected' | 'error';
  aiModelsStatus: 'loaded' | 'loading' | 'error';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

// Security Status Interface
export interface SecurityStatus {
  securityLevel: string;
  encryptionStatus: string;
  activeSessions: number;
  auditTrailLength: number;
  lastAudit: string;
  complianceStandards: string[];
  vulnerabilities: string[];
  recommendations: string[];
  sessionTokens: Record<string, {
    clientId: string;
    createdAt: string;
    expiresAt: string;
  }>;
}

// Performance Metrics Detail Interface
export interface PerformanceMetricsDetail {
  orchestratorMetrics: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    totalCost: number;
    successRate: number;
  };
  agentMetrics: Record<string, {
    executions: number;
    successes: number;
    successRate: number;
    totalCost: number;
    averageExecutionTime: number;
    lastExecution?: string;
  }>;
  mcpMetrics: {
    activeConnections: number;
    totalRequests: number;
    averageRequestDuration: number;
    errorRate: number;
    requestsPerSecond: number;
  };
  securityMetrics: {
    securityLevel: string;
    encryptionStatus: string;
    auditTrailLength: number;
    activeSessions: number;
    lastSecurityAudit: string;
  };
}

// Streaming Progress Interface
export interface StreamingProgress {
  progress: number;
  status: 'initializing' | 'processing' | 'completed' | 'error';
  currentAgent?: string;
  agentsCompleted?: number;
  totalAgents?: number;
  estimatedTimeRemaining?: number;
  result?: any;
  error?: string;
}

// Error Response Interface
export interface ErrorResponse {
  success: false;
  error: string;
  errorCode: string;
  timestamp: string;
  requestId: string;
  details?: Record<string, any>;
}

// Success Response Interface
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  metadata?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

// API Response Union Type
export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Agent Capabilities Mapping
export const AGENT_CAPABILITIES: Record<AgentType, string[]> = {
  [AgentType.LINKEDIN_INTELLIGENCE]: [
    "direct_api_access",
    "sales_navigator_integration",
    "recruiter_api_access",
    "profile_image_analysis",
    "company_logo_recognition",
    "skill_badge_extraction",
    "career_progression_modeling",
    "network_influence_scoring",
    "buying_intent_prediction",
    "job_change_forecasting",
    "real_time_monitoring",
    "compliance_automation"
  ],
  [AgentType.WEB_SCRAPING_MASTER]: [
    "stealth_browsing",
    "anti_detection",
    "dynamic_content_handling",
    "javascript_execution",
    "captcha_solving",
    "rate_limit_bypass",
    "proxy_rotation",
    "session_management",
    "data_validation",
    "quality_assurance"
  ],
  [AgentType.FINANCIAL_ANALYST_AGENT]: [
    "financial_statement_analysis",
    "ratio_analysis",
    "cash_flow_modeling",
    "valuation_modeling",
    "risk_assessment",
    "market_analysis",
    "competitor_analysis",
    "trend_forecasting",
    "regulatory_compliance",
    "audit_trail"
  ],
  // Add capabilities for all other agents...
  [AgentType.DATA_EXTRACTION_EXPERT]: ["data_extraction", "pattern_recognition", "validation"],
  [AgentType.CONTENT_ANALYSIS_SPECIALIST]: ["content_analysis", "sentiment_analysis", "topic_modeling"],
  [AgentType.SALES_NAVIGATOR_AGENT]: ["sales_intelligence", "lead_generation", "prospecting"],
  [AgentType.RECRUITER_API_AGENT]: ["recruitment_intelligence", "candidate_analysis", "job_matching"],
  [AgentType.MARKETING_API_AGENT]: ["marketing_intelligence", "campaign_analysis", "performance_tracking"],
  [AgentType.GOOGLE_ANALYTICS_AGENT]: ["web_analytics", "traffic_analysis", "conversion_tracking"],
  [AgentType.FACEBOOK_INSIGHTS_AGENT]: ["social_media_analytics", "audience_insights", "engagement_analysis"],
  [AgentType.TWITTER_INTELLIGENCE_AGENT]: ["social_intelligence", "trend_analysis", "influence_tracking"],
  [AgentType.INSTAGRAM_ANALYTICS_AGENT]: ["visual_analytics", "engagement_metrics", "influencer_analysis"],
  [AgentType.YOUTUBE_PERFORMANCE_AGENT]: ["video_analytics", "performance_metrics", "audience_analysis"],
  [AgentType.MARKET_RESEARCH_AGENT]: ["market_research", "competitive_analysis", "trend_identification"],
  [AgentType.COMPETITIVE_INTELLIGENCE_AGENT]: ["competitive_intelligence", "market_positioning", "strategy_analysis"],
  [AgentType.TECHNICAL_ANALYSIS_AGENT]: ["technical_analysis", "pattern_recognition", "prediction_modeling"],
  [AgentType.SENTIMENT_ANALYSIS_AGENT]: ["sentiment_analysis", "emotion_detection", "opinion_mining"],
  [AgentType.TREND_PREDICTION_AGENT]: ["trend_prediction", "forecasting", "pattern_analysis"],
  [AgentType.RISK_ASSESSMENT_AGENT]: ["risk_assessment", "threat_analysis", "vulnerability_scanning"],
  [AgentType.COMPLIANCE_MONITOR_AGENT]: ["compliance_monitoring", "regulatory_tracking", "audit_automation"],
  [AgentType.SECURITY_AUDIT_AGENT]: ["security_auditing", "penetration_testing", "vulnerability_assessment"],
  [AgentType.PERFORMANCE_OPTIMIZATION_AGENT]: ["performance_optimization", "efficiency_analysis", "resource_management"],
  [AgentType.COST_OPTIMIZATION_AGENT]: ["cost_optimization", "budget_analysis", "resource_allocation"],
  [AgentType.QUALITY_ASSURANCE_AGENT]: ["quality_assurance", "testing_automation", "defect_detection"],
  [AgentType.ORCHESTRATION_MASTER]: ["orchestration", "workflow_management", "resource_coordination"]
};

// Security Level Descriptions
export const SECURITY_LEVEL_DESCRIPTIONS: Record<SecurityLevel, string> = {
  [SecurityLevel.BASIC]: "SOC 2 and HIPAA compliance (Standard business level)",
  [SecurityLevel.ENHANCED]: "FIPS 140-2 Level 2 (Enhanced security)",
  [SecurityLevel.MILITARY]: "FIPS 140-2 Level 4, EAL7 (Military-grade security)",
  [SecurityLevel.QUANTUM_SAFE]: "Post-quantum cryptography (Future-proof security)"
};

// Agent Type Descriptions
export const AGENT_TYPE_DESCRIPTIONS: Record<AgentType, string> = {
  [AgentType.LINKEDIN_INTELLIGENCE]: "Advanced LinkedIn intelligence gathering with direct API access",
  [AgentType.WEB_SCRAPING_MASTER]: "Military-grade web scraping with anti-detection capabilities",
  [AgentType.DATA_EXTRACTION_EXPERT]: "Expert data extraction and pattern recognition",
  [AgentType.CONTENT_ANALYSIS_SPECIALIST]: "Specialized content analysis and sentiment detection",
  [AgentType.SALES_NAVIGATOR_AGENT]: "Sales Navigator integration and lead generation",
  [AgentType.RECRUITER_API_AGENT]: "Recruiter API integration and candidate analysis",
  [AgentType.MARKETING_API_AGENT]: "Marketing API integration and campaign analysis",
  [AgentType.GOOGLE_ANALYTICS_AGENT]: "Google Analytics integration and web analytics",
  [AgentType.FACEBOOK_INSIGHTS_AGENT]: "Facebook Insights integration and social analytics",
  [AgentType.TWITTER_INTELLIGENCE_AGENT]: "Twitter intelligence and social media analysis",
  [AgentType.INSTAGRAM_ANALYTICS_AGENT]: "Instagram analytics and visual content analysis",
  [AgentType.YOUTUBE_PERFORMANCE_AGENT]: "YouTube performance analytics and video metrics",
  [AgentType.FINANCIAL_ANALYST_AGENT]: "Comprehensive financial analysis and modeling",
  [AgentType.MARKET_RESEARCH_AGENT]: "Market research and competitive analysis",
  [AgentType.COMPETITIVE_INTELLIGENCE_AGENT]: "Competitive intelligence and market positioning",
  [AgentType.TECHNICAL_ANALYSIS_AGENT]: "Technical analysis and pattern recognition",
  [AgentType.SENTIMENT_ANALYSIS_AGENT]: "Sentiment analysis and emotion detection",
  [AgentType.TREND_PREDICTION_AGENT]: "Trend prediction and forecasting",
  [AgentType.RISK_ASSESSMENT_AGENT]: "Risk assessment and threat analysis",
  [AgentType.COMPLIANCE_MONITOR_AGENT]: "Compliance monitoring and regulatory tracking",
  [AgentType.SECURITY_AUDIT_AGENT]: "Security auditing and vulnerability assessment",
  [AgentType.PERFORMANCE_OPTIMIZATION_AGENT]: "Performance optimization and efficiency analysis",
  [AgentType.COST_OPTIMIZATION_AGENT]: "Cost optimization and resource allocation",
  [AgentType.QUALITY_ASSURANCE_AGENT]: "Quality assurance and testing automation",
  [AgentType.ORCHESTRATION_MASTER]: "Master orchestration and workflow management"
};
