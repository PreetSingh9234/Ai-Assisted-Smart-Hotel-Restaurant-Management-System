import React from 'react';

export default function Loading() {
  return (
    <div className="p-6 space-y-6 w-full animate-pulse max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-nora-border rounded w-1/3"></div>
        <div className="h-8 bg-nora-border rounded w-24"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-28 bg-nora-border rounded-card"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 lg:col-span-2 h-96 bg-nora-border rounded-card"></div>
        <div className="col-span-1 h-96 bg-nora-border rounded-card"></div>
      </div>
    </div>
  );
}
