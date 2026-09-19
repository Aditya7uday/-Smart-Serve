import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({ 
  icon: Icon = FileQuestion, 
  title = 'No results found', 
  message = "We couldn't find anything matching your request.",
  actionText,
  actionHref,
  onAction
}) {
  return (
    <div className="w-full p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-secondary-gray">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-dark-text mb-2">{title}</h3>
      <p className="text-secondary-gray max-w-sm mb-6">{message}</p>
      
      {actionText && actionHref && (
        <Link to={actionHref} className="px-6 py-2 bg-primary-orange text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
          {actionText}
        </Link>
      )}
      
      {actionText && onAction && (
        <button onClick={onAction} className="px-6 py-2 bg-primary-orange text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
          {actionText}
        </button>
      )}
    </div>
  );
}
