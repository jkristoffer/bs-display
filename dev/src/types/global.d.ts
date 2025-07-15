// Global type declarations for external libraries and APIs

declare global {
  // Google Analytics gtag function
  function gtag(command: 'config' | 'event' | 'js' | 'set', targetId: string | Date, config?: any): void;
  
  // Mixpanel object
  var mixpanel: {
    track: (eventName: string, properties?: Record<string, any>) => void;
    identify: (userId: string) => void;
    people: {
      set: (properties: Record<string, any>) => void;
    };
    register: (properties: Record<string, any>) => void;
    init: (token: string, config?: any) => void;
  };

  // Window interface extensions
  interface Window {
    gtag?: typeof gtag;
    mixpanel?: typeof mixpanel;
  }
}

export {};