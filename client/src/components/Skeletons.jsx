import React from 'react';

export const DestinationCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export const DestinationGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <DestinationCardSkeleton key={i} />
    ))}
  </div>
);

export const DetailPageSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 py-10">
    <div className="skeleton mb-6 h-72 w-full" />
    <div className="skeleton mb-3 h-8 w-1/3" />
    <div className="skeleton mb-2 h-4 w-full" />
    <div className="skeleton mb-2 h-4 w-5/6" />
    <div className="skeleton h-4 w-2/3" />
  </div>
);

export const CardRowSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton h-16 w-full" />
    ))}
  </div>
);
