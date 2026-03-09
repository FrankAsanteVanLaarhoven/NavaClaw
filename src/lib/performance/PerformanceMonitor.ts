/**
 * Performance Monitor - Advanced performance monitoring and optimization
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isInitialized = false;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public initialize(): void {
    if (this.isInitialized) return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network performance
    this.monitorNetworkPerformance();
    
    // Monitor user interactions
    this.monitorUserInteractions();

    this.isInitialized = true;
  }

  private monitorCoreWebVitals(): void {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('lcp', lastEntry.startTime);
        this.reportMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.set('fid', entry.processingStart - entry.startTime);
          this.reportMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.set('cls', clsValue);
            this.reportMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private monitorResourceLoading(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const resourceName = entry.name;
          const loadTime = entry.duration;
          
          // Track slow resources
          if (loadTime > 1000) {
            this.reportSlowResource(resourceName, loadTime);
          }
          
          this.metrics.set(`resource_${resourceName}`, loadTime);
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      setInterval(() => {
        const usedMemory = memory.usedJSHeapSize;
        const totalMemory = memory.totalJSHeapSize;
        const memoryUsage = (usedMemory / totalMemory) * 100;
        
        this.metrics.set('memory_usage', memoryUsage);
        
        // Alert if memory usage is high
        if (memoryUsage > 80) {
          this.reportHighMemoryUsage(memoryUsage);
        }
      }, 5000);
    }
  }

  private monitorNetworkPerformance(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection) {
        this.metrics.set('network_type', connection.effectiveType);
        this.metrics.set('network_speed', connection.downlink);
        
        connection.addEventListener('change', () => {
          this.metrics.set('network_type', connection.effectiveType);
          this.metrics.set('network_speed', connection.downlink);
        });
      }
    }
  }

  private monitorUserInteractions(): void {
    // Monitor click events
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      
      this.metrics.set('interaction_click', Date.now());
      this.reportUserInteraction('click', tagName, className);
    });

    // Monitor scroll events
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.metrics.set('interaction_scroll', Date.now());
        this.reportUserInteraction('scroll', 'document', '');
      }, 100);
    });
  }

  private reportMetric(name: string, value: number): void {
    // Send metrics to analytics or monitoring service
    console.log(`Performance Metric - ${name}: ${value}`);
    
    // In a real application, you would send this to your analytics service
    // Example: analytics.track('performance_metric', { name, value });
  }

  private reportSlowResource(resourceName: string, loadTime: number): void {
    console.warn(`Slow Resource Detected - ${resourceName}: ${loadTime}ms`);
    
    // In a real application, you would send this to your monitoring service
    // Example: monitoring.alert('slow_resource', { resourceName, loadTime });
  }

  private reportHighMemoryUsage(usage: number): void {
    console.warn(`High Memory Usage Detected: ${usage.toFixed(2)}%`);
    
    // In a real application, you would send this to your monitoring service
    // Example: monitoring.alert('high_memory_usage', { usage });
  }

  private reportUserInteraction(type: string, element: string, className: string): void {
    // Track user interactions for analytics
    console.log(`User Interaction - ${type}: ${element} (${className})`);
    
    // In a real application, you would send this to your analytics service
    // Example: analytics.track('user_interaction', { type, element, className });
  }

  public getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  public getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  public setMetric(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  public getPerformanceReport(): object {
    const report: any = {};
    
    // Core Web Vitals
    report.lcp = this.metrics.get('lcp');
    report.fid = this.metrics.get('fid');
    report.cls = this.metrics.get('cls');
    
    // Memory usage
    report.memoryUsage = this.metrics.get('memory_usage');
    
    // Network information
    report.networkType = this.metrics.get('network_type');
    report.networkSpeed = this.metrics.get('network_speed');
    
    // User interactions
    report.lastClick = this.metrics.get('interaction_click');
    report.lastScroll = this.metrics.get('interaction_scroll');
    
    return report;
  }

  public optimizePerformance(): void {
    // Implement performance optimization strategies
    
    // Lazy load images
    this.lazyLoadImages();
    
    // Optimize animations
    this.optimizeAnimations();
    
    // Preload critical resources
    this.preloadCriticalResources();
  }

  private lazyLoadImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  private optimizeAnimations(): void {
    // Use transform and opacity for better performance
    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach((element) => {
      element.style.willChange = 'transform, opacity';
    });
  }

  private preloadCriticalResources(): void {
    // Preload critical CSS and JS files
    const criticalResources = [
      '/api/mcp/health',
      '/api/mcp/agents'
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'fetch';
      document.head.appendChild(link);
    });
  }

  public destroy(): void {
    // Clean up observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    
    // Clear metrics
    this.metrics.clear();
    
    this.isInitialized = false;
  }
}
