import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface QuizErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface QuizErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * QuizErrorBoundary - Error boundary specifically for quiz components
 * 
 * Provides graceful error handling for the quiz system with user-friendly
 * fallback UI and error reporting.
 */
export class QuizErrorBoundary extends Component<QuizErrorBoundaryProps, QuizErrorBoundaryState> {
  constructor(props: QuizErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): QuizErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('Quiz Error Boundary caught an error:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendErrorReport(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="quiz-error-boundary">
          <div className="quiz-error-content">
            <h3>🤔 Something went wrong with the quiz</h3>
            <p>
              We apologize for the inconvenience. The quiz encountered an unexpected error.
            </p>
            <div className="quiz-error-actions">
              <button 
                className="cta-button cta-button--primary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <button 
                className="cta-button cta-button--ghost"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="quiz-error-details">
                <summary>Error Details (Development)</summary>
                <pre className="quiz-error-stack">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with quiz error boundary
 */
export function withQuizErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <QuizErrorBoundary fallback={fallback}>
      <Component {...props} />
    </QuizErrorBoundary>
  );

  WrappedComponent.displayName = `withQuizErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}