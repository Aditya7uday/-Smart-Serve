import React from 'react';

const STATUS_COLORS = {
  // Order statuses
  'Placed': 'bg-gray-100 text-gray-800 border-gray-200',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
  'Preparing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Ready': 'bg-success-green/20 text-success-green border-success-green/30',
  'Ready for Pickup': 'bg-success-green/20 text-success-green border-success-green/30',
  'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-200',
  'Delivered': 'bg-gray-100 text-gray-600 border-gray-200 line-through',
  'Collected': 'bg-gray-100 text-gray-600 border-gray-200',
  'Cancelled': 'bg-red-100 text-red-800 border-red-200',
  
  // Delivery Staff statuses
  'Accepted': 'bg-blue-100 text-blue-800 border-blue-200',
  'Picked Up': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  
  // Inventory Statuses
  'In Stock': 'bg-success-green/20 text-success-green border-success-green/30',
  'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
  
  // Default fallback
  'Default': 'bg-gray-100 text-gray-800 border-gray-200',
};

export function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS['Default'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
}
