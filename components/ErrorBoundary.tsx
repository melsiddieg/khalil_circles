import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-8 text-center" dir="rtl">
          <h1 className="text-3xl font-bold text-amber-400 font-amiri mb-3">حدث خطأ غير متوقع</h1>
          <p className="text-gray-400 mb-2 font-amiri">نعتذر، تعذّر عرض هذه الصفحة.</p>
          <p className="text-gray-500 text-sm mb-6 font-inter">Something went wrong while rendering the page.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-amiri text-lg"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
