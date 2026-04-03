import React, { ReactNode, Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

// Pages
import Home from './pages/Home';
import PortfolioDetail from './pages/PortfolioDetail';
import ServiceDetail from './pages/ServiceDetail';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if ((this as any).state.hasError) {
      const error = (this as any).state.error;
      const errorMessage = error?.message || "An unexpected error occurred.";
      
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-brand-accent/20">
            <AlertCircle className="text-red-500 mx-auto mb-6" size={48} />
            <h2 className="text-2xl font-serif mb-4 text-brand-ink">Something went wrong</h2>
            <p className="text-brand-muted mb-6 text-sm">
              {errorMessage.startsWith('{') 
                ? "A database connection error occurred. Please check your configuration."
                : errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-ink transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          {/* Fallback to home for unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
