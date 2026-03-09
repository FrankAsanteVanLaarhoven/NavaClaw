/**
 * API Integration Service
 * ======================
 * 
 * Comprehensive API client for communicating with the specialized agents backend.
 * Handles all API calls for site analysis, prompt generation, and agent management.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface PromptType {
  id: string;
  name: string;
  description: string;
}

export interface SiteAnalysis {
  platform: string;
  capabilities: string[];
  analysis: Record<string, any>;
}

export interface PromptGenerationRequest {
  url: string;
  agent_type: string;
  prompt_type: string;
}

export interface PromptGenerationResponse {
  success: boolean;
  prompt: string;
  agent_type: string;
  prompt_type: string;
  timestamp: string;
}

export interface NaturalLanguageRequest {
  prompt: string;
  agent_type?: string;
  prompt_type?: string;
}

export interface NaturalLanguageResponse {
  success: boolean;
  original_prompt: string;
  analysis: {
    detected_platform: string;
    intent: string;
    search_query: string;
    keywords: string[];
  };
  search_results: Array<{
    url: string;
    title: string;
    snippet: string;
    relevance_score: number;
  }>;
  website_analysis?: {
    platform: string;
    confidence: number;
    features: string[];
    url: string;
    title: string;
    meta_description: string;
  };
  specialized_prompt: string;
  recommended_agent: string;
  recommended_prompt_type: string;
  timestamp: string;
}

export interface WebSearchRequest {
  query: string;
  max_results?: number;
}

export interface WebSearchResponse {
  success: boolean;
  query: string;
  results: Array<{
    url: string;
    title: string;
    snippet: string;
    relevance_score: number;
  }>;
  total_count: number;
  timestamp: string;
}

export interface WebsiteAnalysisRequest {
  url: string;
}

export interface WebsiteAnalysisResponse {
  success: boolean;
  analysis: {
    platform: string;
    confidence: number;
    features: string[];
    url: string;
    title: string;
    meta_description: string;
  };
  timestamp: string;
}

export interface BusinessInsightsRequest {
  company_name: string;
  domain?: string;
}

export interface BusinessInsightsResponse {
  success: boolean;
  company_profile: {
    name: string;
    domain: string;
    industry: string;
    founded_year?: number;
    headquarters?: string;
    ceo?: string;
    employees?: number;
    revenue?: number;
    market_cap?: number;
    ticker?: string;
    website: string;
    insights: Record<string, any>;
    last_updated: string;
  };
  insights: {
    basic_info: any;
    financial_data: any;
    social_intelligence: any;
    technology_stack: any;
    blockchain_crypto: any;
    operations: any;
    supply_chain: any;
    legal_compliance: any;
    market_analysis: any;
    news_publications: any;
    competitive_analysis: any;
  };
  extraction_summary: {
    total_aspects_analyzed: number;
    data_points_extracted: number;
    confidence_score: number;
    completeness_score: number;
  };
  timestamp: string;
}

export interface BusinessAspectRequest {
  company_name: string;
  aspect: string;
}

export interface BusinessAspectResponse {
  success: boolean;
  company_name: string;
  aspect: string;
  data: any;
  timestamp: string;
}

export interface BusinessAspect {
  id: string;
  name: string;
  description: string;
}

export interface BusinessAspectsResponse {
  aspects: BusinessAspect[];
  total_count: number;
  timestamp: string;
}

export interface ProcessingResult {
  id: number;
  agent: string;
  content: string;
  timestamp: string;
  status: 'processing' | 'success' | 'error';
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  }

  // Specialized Agents API
  async getSpecializedAgents(): Promise<{ agents: Agent[]; total_count: number; timestamp: string }> {
    return this.request('/api/specialized-agents/agents');
  }

  async getPromptTypes(): Promise<{ prompt_types: PromptType[]; total_count: number; timestamp: string }> {
    return this.request('/api/specialized-agents/prompt-types');
  }

  async analyzeSite(url: string, agentType: string = 'dynamic'): Promise<{ success: boolean; analysis: SiteAnalysis; timestamp: string }> {
    return this.request('/api/specialized-agents/analyze', {
      method: 'POST',
      body: JSON.stringify({ url, agent_type: agentType }),
    });
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResponse> {
    return this.request('/api/specialized-agents/generate-prompt', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Microservices Agents API
  async getSystemStatus(): Promise<any> {
    return this.request('/api/agents/status');
  }

  async getAllAgents(): Promise<any> {
    return this.request('/api/agents/agents');
  }

  async getAgentStatus(agentId: string): Promise<any> {
    return this.request(`/api/agents/agents/${agentId}`);
  }

  async submitTask(taskData: any): Promise<any> {
    return this.request('/api/agents/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTaskStatus(taskId: string): Promise<any> {
    return this.request(`/api/agents/tasks/${taskId}`);
  }

  async getAllTasks(status?: string, limit: number = 50, offset: number = 0): Promise<any> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    return this.request(`/api/agents/tasks?${params.toString()}`);
  }

  // Testing and Clean Code Agents
  async executeTestingTask(taskData: any): Promise<any> {
    return this.request('/api/agents/testing/execute', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async executeCleanCodeTask(taskData: any): Promise<any> {
    return this.request('/api/agents/clean-code/execute', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Performance Metrics
  async getPerformanceMetrics(): Promise<any> {
    return this.request('/api/agents/performance/metrics');
  }

  // Agent Heartbeat
  async sendAgentHeartbeat(agentId: string, heartbeatData: any): Promise<any> {
    return this.request(`/api/agents/agents/${agentId}/heartbeat`, {
      method: 'POST',
      body: JSON.stringify(heartbeatData),
    });
  }

  // Task Management
  async cancelTask(taskId: string): Promise<any> {
    return this.request(`/api/agents/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  // Version Info
  async getVersion(): Promise<any> {
    return this.request('/version');
  }

  // Research Agents API
  async processNaturalLanguage(request: NaturalLanguageRequest): Promise<NaturalLanguageResponse> {
    return this.request('/api/research-agents/process-natural-language', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async searchWeb(request: WebSearchRequest): Promise<WebSearchResponse> {
    return this.request('/api/research-agents/search-web', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async analyzeWebsite(request: WebsiteAnalysisRequest): Promise<WebsiteAnalysisResponse> {
    return this.request('/api/research-agents/analyze-website', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getResearchCapabilities(): Promise<any> {
    return this.request('/api/research-agents/capabilities');
  }

  // Business Insights API
  async extractBusinessInsights(request: BusinessInsightsRequest): Promise<BusinessInsightsResponse> {
    return this.request('/api/business-insights/extract-business-insights', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async extractSpecificAspect(request: BusinessAspectRequest): Promise<BusinessAspectResponse> {
    return this.request('/api/business-insights/extract-specific-aspect', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getSupportedBusinessAspects(): Promise<BusinessAspectsResponse> {
    return this.request('/api/business-insights/supported-aspects');
  }

  async getBusinessInsightsCapabilities(): Promise<any> {
    return this.request('/api/business-insights/capabilities');
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Utility functions for common operations
export const apiUtils = {
  /**
   * Simulate processing stages for UI feedback
   */
  async simulateProcessingStages(
    url: string,
    agentType: string,
    onProgress: (result: ProcessingResult) => void
  ): Promise<void> {
    const stages = [
      {
        id: 1,
        agent: 'Site Analyzer',
        content: `🔍 Analyzing ${url} for site type and technology stack...`,
        status: 'processing' as const,
      },
      {
        id: 2,
        agent: 'Technology Detector',
        content: `🔧 Detected site type: ${agentType}. Analyzing technology stack...`,
        status: 'success' as const,
      },
      {
        id: 3,
        agent: getAgentDisplayName(agentType),
        content: `🕷️ ${getAgentDisplayName(agentType)} activated. Extracting specialized content...`,
        status: 'processing' as const,
      },
      {
        id: 4,
        agent: 'Content Extractor',
        content: `📄 Extracting dynamic content, components, and assets. Found 25+ dynamic elements and 15+ interactive components.`,
        status: 'success' as const,
      },
      {
        id: 5,
        agent: 'AI Prompt Generator',
        content: `🤖 Generated specialized AI prompt for ${agentType} site. Ready for copy/download.`,
        status: 'success' as const,
      },
    ];

    for (const stage of stages) {
      onProgress({
        ...stage,
        timestamp: new Date().toLocaleTimeString(),
      });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },

  /**
   * Generate specialized prompt based on agent type and prompt type
   */
  generateSpecializedPrompt(
    url: string,
    agentType: string,
    promptType: string
  ): string {
    const agentPrompts: Record<string, Record<string, string>> = {
      wordpress: {
        cursor: `Create an exact clone of this WordPress site: ${url}

WordPress-Specific Requirements:
- Extract and recreate WordPress theme structure
- Identify and document all active plugins
- Recreate custom post types and taxonomies
- Extract WordPress database structure
- Recreate dynamic content and widgets
- Include WordPress-specific functionality
- Extract custom fields and meta data
- Recreate WordPress admin functionality
- Include WordPress hooks and filters
- Extract and recreate WordPress REST API endpoints

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement WordPress-like CMS functionality
- Use Tailwind CSS for styling
- Include WordPress-specific components
- Recreate WordPress admin interface
- Implement WordPress-like routing
- Include WordPress security features
- Optimize for WordPress-like performance`,
        bolt: `Create a Bolt AI prompt for WordPress site: ${url}

WordPress Development Requirements:
- Full WordPress-like CMS system
- Custom post types and taxonomies
- Plugin architecture and system
- WordPress admin interface
- Database design for WordPress
- REST API endpoints
- Theme system implementation
- Widget and sidebar system
- User roles and permissions
- WordPress security features`,
      },
      framer: {
        cursor: `Create an exact clone of this Framer site: ${url}

Framer-Specific Requirements:
- Extract all Framer components and layouts
- Recreate Framer animations and interactions
- Extract design tokens and styles
- Recreate Framer's component system
- Include Framer-specific interactions
- Extract Framer's responsive design
- Recreate Framer's navigation system
- Include Framer's state management
- Extract Framer's asset system
- Recreate Framer's prototyping features

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement Framer Motion for animations
- Use Tailwind CSS for styling
- Include Framer-like component system
- Recreate Framer interactions
- Implement Framer-like state management
- Include Framer's responsive design
- Optimize for Framer-like performance`,
        bolt: `Create a Bolt AI prompt for Framer site: ${url}

Framer Development Requirements:
- Component-based architecture
- Animation and interaction system
- Design token system
- Responsive design implementation
- State management system
- Asset management system
- Prototyping features
- Interactive elements
- Design system implementation
- Animation framework integration`,
      },
      webflow: {
        cursor: `Create an exact clone of this Webflow site: ${url}

Webflow-Specific Requirements:
- Extract Webflow CMS content and structure
- Recreate Webflow's dynamic interactions
- Extract Webflow's custom code
- Recreate Webflow's form system
- Include Webflow's e-commerce features
- Extract Webflow's database structure
- Recreate Webflow's member areas
- Include Webflow's dynamic content
- Extract Webflow's asset management
- Recreate Webflow's SEO features

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement Webflow-like CMS
- Use Tailwind CSS for styling
- Include Webflow interactions
- Recreate Webflow forms
- Implement Webflow-like database
- Include Webflow e-commerce
- Optimize for Webflow-like performance`,
        bolt: `Create a Bolt AI prompt for Webflow site: ${url}

Webflow Development Requirements:
- CMS system implementation
- Dynamic interaction system
- Form handling system
- E-commerce functionality
- Member area system
- Database design for CMS
- Asset management system
- SEO optimization features
- Custom code integration
- Dynamic content system`,
      },
      square: {
        cursor: `Create an exact clone of this Square Commerce site: ${url}

Square-Specific Requirements:
- Extract Square product catalog and inventory
- Recreate Square's payment system
- Extract Square's customer data structure
- Recreate Square's order management
- Include Square's analytics and reporting
- Extract Square's shipping and tax systems
- Recreate Square's customer accounts
- Include Square's marketing tools
- Extract Square's API integrations
- Recreate Square's mobile optimization

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement Square-like e-commerce
- Use Tailwind CSS for styling
- Include Square payment integration
- Recreate Square product system
- Implement Square-like analytics
- Include Square security features
- Optimize for Square-like performance`,
        bolt: `Create a Bolt AI prompt for Square Commerce site: ${url}

Square Development Requirements:
- E-commerce platform implementation
- Payment system integration
- Product catalog management
- Order processing system
- Customer management system
- Inventory management
- Analytics and reporting
- Shipping and tax calculation
- Mobile optimization
- API integration system`,
      },
      woocommerce: {
        cursor: `Create an exact clone of this WooCommerce store: ${url}

WooCommerce-Specific Requirements:
- Extract WooCommerce product catalog
- Recreate WooCommerce payment gateways
- Extract WooCommerce order system
- Recreate WooCommerce customer accounts
- Include WooCommerce shipping methods
- Extract WooCommerce tax calculations
- Recreate WooCommerce coupons and discounts
- Include WooCommerce reporting
- Extract WooCommerce extensions
- Recreate WooCommerce admin interface

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement WooCommerce-like e-commerce
- Use Tailwind CSS for styling
- Include WooCommerce payment system
- Recreate WooCommerce product management
- Implement WooCommerce-like admin
- Include WooCommerce security
- Optimize for WooCommerce-like performance`,
        bolt: `Create a Bolt AI prompt for WooCommerce store: ${url}

WooCommerce Development Requirements:
- E-commerce platform implementation
- Payment gateway integration
- Product management system
- Order processing system
- Customer account system
- Shipping and tax calculation
- Coupon and discount system
- Reporting and analytics
- Extension system
- Admin interface implementation`,
      },
      figma: {
        cursor: `Create an exact clone of this Figma design: ${url}

Figma-Specific Requirements:
- Extract Figma design components
- Recreate Figma's design system
- Extract Figma's color palette and typography
- Recreate Figma's component variants
- Include Figma's auto-layout features
- Extract Figma's design tokens
- Recreate Figma's responsive design
- Include Figma's interaction prototypes
- Extract Figma's asset library
- Recreate Figma's design patterns

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement Figma-like design system
- Use Tailwind CSS for styling
- Include Figma component variants
- Recreate Figma interactions
- Implement Figma-like responsive design
- Include Figma design tokens
- Optimize for Figma-like design fidelity`,
        bolt: `Create a Bolt AI prompt for Figma design: ${url}

Figma Development Requirements:
- Design system implementation
- Component library creation
- Design token system
- Responsive design implementation
- Interaction prototyping
- Asset management system
- Auto-layout system
- Component variant system
- Design pattern implementation
- Visual design optimization`,
      },
      dynamic: {
        cursor: `Create an exact clone of this dynamic site: ${url}

Dynamic Content Requirements:
- Extract SPA functionality and routing
- Recreate JavaScript-heavy interactions
- Extract API endpoints and data flow
- Recreate real-time data updates
- Include dynamic content loading
- Extract client-side state management
- Recreate progressive web app features
- Include dynamic form handling
- Extract real-time notifications
- Recreate dynamic user interfaces

Technical Requirements:
- Use Next.js 14 with TypeScript
- Implement SPA-like functionality
- Use Tailwind CSS for styling
- Include dynamic content loading
- Recreate real-time features
- Implement client-side routing
- Include state management
- Optimize for dynamic performance`,
        bolt: `Create a Bolt AI prompt for dynamic site: ${url}

Dynamic Development Requirements:
- SPA implementation
- Real-time data handling
- API integration system
- State management implementation
- Dynamic content system
- Progressive web app features
- Client-side routing
- Real-time notifications
- Dynamic form handling
- Performance optimization`,
      },
    };

    const agentPromptsForType = agentPrompts[agentType];
    if (agentPromptsForType && agentPromptsForType[promptType]) {
      return agentPromptsForType[promptType];
    }

    // Default prompts
    const defaultPrompts: Record<string, string> = {
      cursor: `Create an exact clone of this website: ${url}

Requirements:
- Use Next.js 14 with TypeScript
- Implement Tailwind CSS for styling
- Use Framer Motion for animations
- Include all interactive elements
- Match the exact layout and design
- Implement responsive design
- Include all functionality and features
- Use modern React patterns and hooks
- Ensure accessibility compliance
- Optimize for performance`,
      bolt: `Create a Bolt AI prompt for: ${url}

Development Requirements:
- Full-stack web application
- Modern tech stack implementation
- Database design and structure
- API endpoints and functionality
- User authentication system
- Responsive design implementation
- Performance optimization
- Security best practices
- Deployment configuration
- Complete documentation`,
    };

    return defaultPrompts[promptType] || defaultPrompts.cursor;
  },
};

/**
 * Get display name for agent type
 */
export function getAgentDisplayName(agentType: string): string {
  const agentNames: Record<string, string> = {
    wordpress: 'WordPress Crawler',
    framer: 'Framer Extractor',
    webflow: 'Webflow Scraper',
    square: 'Square Commerce',
    woocommerce: 'WooCommerce',
    figma: 'Figma Assets',
    dynamic: 'Dynamic Content',
    mobile: 'Mobile Apps',
  };

  return agentNames[agentType] || 'Universal Crawler';
}

export default apiService; 