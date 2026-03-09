/**
 * Expert Accessibility - Advanced accessibility features for the application
 */

export class ExpertAccessibility {
  private static instance: ExpertAccessibility;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ExpertAccessibility {
    if (!ExpertAccessibility.instance) {
      ExpertAccessibility.instance = new ExpertAccessibility();
    }
    return ExpertAccessibility.instance;
  }

  public setupExpertKeyboardNavigation(): void {
    if (this.isInitialized) return;
    
    // Add keyboard navigation support
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    
    // Add focus management
    this.setupFocusManagement();
    
    // Add screen reader support
    this.setupScreenReaderSupport();
    
    this.isInitialized = true;
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    // Handle keyboard shortcuts
    switch (event.key) {
      case 'Tab':
        this.handleTabNavigation(event);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(event);
        break;
      case 'Escape':
        this.handleEscape(event);
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    // Ensure proper tab order
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Add visual focus indicators
    focusableElements.forEach((element) => {
      element.addEventListener('focus', () => {
        element.classList.add('focus-visible');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focus-visible');
      });
    });
  }

  private handleActivation(event: KeyboardEvent): void {
    // Handle Enter and Space key activation
    const target = event.target as HTMLElement;
    if (target && target.click) {
      event.preventDefault();
      target.click();
    }
  }

  private handleEscape(event: KeyboardEvent): void {
    // Handle Escape key for closing modals, dropdowns, etc.
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }
  }

  private setupFocusManagement(): void {
    // Manage focus for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Handle new content focus management
          this.manageFocusForNewContent(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private manageFocusForNewContent(nodes: NodeList): void {
    nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const focusableElement = element.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElement) {
          (focusableElement as HTMLElement).focus();
        }
      }
    });
  }

  private setupScreenReaderSupport(): void {
    // Add ARIA labels and roles
    this.addAriaSupport();
    
    // Add live regions for dynamic content
    this.addLiveRegions();
  }

  private addAriaSupport(): void {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
      if (!button.getAttribute('aria-label')) {
        const text = button.textContent?.trim();
        if (text) {
          button.setAttribute('aria-label', text);
        }
      }
    });
  }

  private addLiveRegions(): void {
    // Add live regions for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  public announceToScreenReader(message: string): void {
    const liveRegion = document.querySelector('[aria-live="polite"]') as HTMLElement;
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  public setHighContrastMode(enabled: boolean): void {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }

  public setReducedMotion(enabled: boolean): void {
    if (enabled) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }
}
