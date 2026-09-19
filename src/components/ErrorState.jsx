import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export function ErrorState({ 
  title = 'Something went wrong', 
  message = "An error occurred while loading this content. Please try again.",
  onRetry
}) {
  return (
    <div className="w-full p-8 flex flex-col items-center justify-center text-center border border-red-100 rounded-xl bg-red-50">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-600 max-w-sm mb-6">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-md font-medium hover:bg-red-50 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
