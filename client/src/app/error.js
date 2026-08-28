'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('PolicyPulse Global Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary p-4">
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We apologize, but an unexpected error has occurred in the application interface.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </div>
    </div>
  );
}
