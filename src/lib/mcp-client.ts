/**
 * Iron Cloud Nexus AI - MCP Client
 * TypeScript client for advanced MCP server integration
 */

import { AgentType, SecurityLevel } from './types/mcp';

// Re-export types for convenience
export { AgentType, SecurityLevel };

// MCP Client Configuration
export interface MCPClientConfig {
  baseUrl: string;
  apiKey?: string;
  securityLevel: SecurityLevel;
  timeout: number;
  retryAttempts: number;
}

// MCP Request/Response Types
export interface MCPRequest {
  id: string;
  method: string;
  params?: Record<string, any>;
  messageType: 'request' | 'response' | 'notification' | 'error';
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
  executionTime?: number;
  securityAuditTrail?: string[];
}

// Intelligence Request Types
export interface IntelligenceRequest {
  query: Record<string, any>;
  targetAgents?: string[];
  priority?: 'low' | 'normal' | 'high' | 'critical';
  timeout?: number;
}

export interface IntelligenceResponse {
  success: boolean;
  data?: Record<string, any>;
  agentsUsed: string[];
  executionTime: number;
  costOptimization: string;
  securityLevel: string;
  qualityScore: number;
}

// Agent Execution Types
export interface AgentExecutionRequest {
  agentType: string;
  arguments: Record<string, any>;
  securityLevel?: SecurityLevel;
}

export interface AgentExecutionResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
  executionTime: number;
  securityAuditTrail: string[];
}

// Security Audit Types
export interface SecurityAuditRequest {
  auditType: 'basic' | 'comprehensive' | 'military';
  target?: string;
  complianceStandards?: string[];
}

export interface SecurityAuditResponse {
  securityLevel: string;
  encryptionStatus: string;
  complianceStandards: string[];
  vulnerabilities: string[];
  recommendations: string[];
  auditTrailLength: number;
}

// Performance Metrics Types
export interface PerformanceMetrics {
  agentMetrics?: Record<string, any>;
  mcpMetrics?: Record<string, any>;
  securityMetrics?: Record<string, any>;
}

// MCP Client Class
export class MCPClient {
  private config: MCPClientConfig;
  private sessionToken?: string;
  private requestId = 0;

  constructor(config: MCPClientConfig) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:8000/api/mcp',
      securityLevel: config.securityLevel || SecurityLevel.MILITARY,
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      ...config
    };
  }

  /**
   * Initialize MCP client and establish session
   */
  async initialize(clientId?: string): Promise<boolean> {
    try {
      const response = await this.makeRequest({
        method: 'initialize',
        params: {
          client_id: clientId || this.generateClientId(),
          security_level: this.config.securityLevel
        }
      });

      if (response.success && response.data?.session_token) {
        this.sessionToken = response.data.session_token;
        return true;
      }

      return false;
    } catch (error) {
      console.error('MCP client initialization failed:', error);
      return false;
    }
  }

  /**
   * Make authenticated request to MCP server
   */
  private async makeRequest(request: Omit<MCPRequest, 'id' | 'messageType'>): Promise<MCPResponse> {
    if (!this.sessionToken) {
      throw new Error('MCP client not initialized. Call initialize() first.');
    }

    const mcpRequest: MCPRequest = {
      id: this.generateRequestId(),
      method: request.method,
      params: request.params,
      messageType: 'request'
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.sessionToken}`
    };

    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/request`, {
        method: 'POST',
        headers,
        body: JSON.stringify(mcpRequest),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: MCPResponse = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Gather intelligence using advanced agent orchestrator
   */
  async gatherIntelligence(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/intelligence/gather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Intelligence gathering failed:', error);
      throw error;
    }
  }

  /**
   * Execute specific agent
   */
  async executeAgent(request: AgentExecutionRequest): Promise<AgentExecutionResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/agents/${request.agentType}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({
          arguments: request.arguments,
          security_level: request.securityLevel || this.config.securityLevel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Agent execution failed:', error);
      throw error;
    }
  }

  /**
   * List available agents
   */
  async listAgents(): Promise<{ agents: any[]; totalCount: number; activeCount: number; securityLevel: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/agents`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list agents:', error);
      throw error;
    }
  }

  /**
   * Get agent performance metrics
   */
  async getAgentMetrics(agentName: string): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/agents/${agentName}/metrics`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get agent metrics:', error);
      throw error;
    }
  }

  /**
   * Perform security audit
   */
  async performSecurityAudit(request: SecurityAuditRequest): Promise<SecurityAuditResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/security/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Security audit failed:', error);
      throw error;
    }
  }

  /**
   * Get security status
   */
  async getSecurityStatus(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/security/status`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get security status:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(options?: {
    includeAgentMetrics?: boolean;
    includeMCPMetrics?: boolean;
    includeSecurityMetrics?: boolean;
  }): Promise<PerformanceMetrics> {
    try {
      const params = new URLSearchParams();
      if (options?.includeAgentMetrics !== undefined) {
        params.append('include_agent_metrics', options.includeAgentMetrics.toString());
      }
      if (options?.includeMCPMetrics !== undefined) {
        params.append('include_mcp_metrics', options.includeMCPMetrics.toString());
      }
      if (options?.includeSecurityMetrics !== undefined) {
        params.append('include_security_metrics', options.includeSecurityMetrics.toString());
      }

      const response = await fetch(`${this.config.baseUrl}/performance/metrics?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get Prometheus metrics
   */
  async getPrometheusMetrics(): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/performance/metrics/prometheus`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Failed to get Prometheus metrics:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Stream intelligence gathering progress
   */
  async streamIntelligenceGathering(
    request: IntelligenceRequest,
    onProgress?: (progress: number, status: string) => void,
    onComplete?: (result: any) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/intelligence/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.progress !== undefined && onProgress) {
                onProgress(data.progress, data.status);
              }
              
              if (data.status === 'completed' && data.result && onComplete) {
                onComplete(data.result);
              }
              
              if (data.error && onError) {
                onError(data.error);
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Intelligence streaming failed:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  /**
   * Batch execute multiple agents
   */
  async batchExecuteAgents(agents: Array<{ agent: string; arguments: Record<string, any> }>): Promise<{
    batchId: string;
    totalAgents: number;
    successfulExecutions: number;
    failedExecutions: number;
    results: any[];
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/agents/batch-execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify(agents)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Batch agent execution failed:', error);
      throw error;
    }
  }

  /**
   * List available tools
   */
  async listTools(): Promise<{ tools: any[] }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tools`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list tools:', error);
      throw error;
    }
  }

  /**
   * Execute specific tool
   */
  async executeTool(toolName: string, toolArguments: Record<string, any>): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tools/${toolName}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ arguments: toolArguments })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Tool execution failed:', error);
      throw error;
    }
  }

  /**
   * List available resources
   */
  async listResources(): Promise<{ resources: any[] }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/resources`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list resources:', error);
      throw error;
    }
  }

  /**
   * Read specific resource
   */
  async readResource(resourceUri: string): Promise<{ contents: any[] }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/resources/${encodeURIComponent(resourceUri)}`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to read resource:', error);
      throw error;
    }
  }

  /**
   * Write to specific resource
   */
  async writeResource(resourceUri: string, content: Record<string, any>): Promise<{ success: boolean; uri: string; metadata: Record<string, any> }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/resources/${encodeURIComponent(resourceUri)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to write resource:', error);
      throw error;
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestId}`;
  }

  /**
   * Get current session token
   */
  getSessionToken(): string | undefined {
    return this.sessionToken;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return !!this.sessionToken;
  }

  /**
   * Get client configuration
   */
  getConfig(): MCPClientConfig {
    return { ...this.config };
  }
}

// Default MCP client instance
export const defaultMCPClient = new MCPClient({
  baseUrl: process.env.NEXT_PUBLIC_MCP_BASE_URL || 'http://localhost:8000/api/mcp',
  securityLevel: SecurityLevel.MILITARY,
  timeout: 30000,
  retryAttempts: 3
});

// Export convenience functions
export const initializeMCP = (clientId?: string) => defaultMCPClient.initialize(clientId);
export const gatherIntelligence = (request: IntelligenceRequest) => defaultMCPClient.gatherIntelligence(request);
export const executeAgent = (request: AgentExecutionRequest) => defaultMCPClient.executeAgent(request);
export const listAgents = () => defaultMCPClient.listAgents();
export const performSecurityAudit = (request: SecurityAuditRequest) => defaultMCPClient.performSecurityAudit(request);
export const getPerformanceMetrics = (options?: Parameters<typeof defaultMCPClient.getPerformanceMetrics>[0]) => defaultMCPClient.getPerformanceMetrics(options);
