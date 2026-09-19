import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...', fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
    : "w-full p-12 flex flex-col items-center justify-center";

  return (
    <div className={containerClasses}>
      <Loader2 className="w-10 h-10 text-primary-orange animate-spin mb-4" />
      <p className="text-secondary-gray font-medium">{message}</p>
    </div>
  );
}
