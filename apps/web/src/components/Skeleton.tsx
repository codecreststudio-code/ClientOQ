import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded-[2px] ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-hairline bg-canvas-soft/40 p-6 rounded-xs space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Grid of Main Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-hairline bg-canvas-soft/40 p-6 rounded-xs space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="border border-hairline bg-canvas-soft/40 p-6 rounded-xs space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeadsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, col) => (
          <div key={col} className="border border-hairline bg-canvas-soft/20 p-4 rounded-xs space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
            {[...Array(3)].map((_, card) => (
              <div key={card} className="border border-hairline bg-canvas-soft/55 p-4 rounded-xs space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinanceSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="border border-hairline rounded-xs overflow-hidden">
        <div className="bg-canvas-soft/80 p-4 border-b border-hairline grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        <div className="bg-canvas/40 divide-y divide-hairline">
          {[...Array(5)].map((_, row) => (
            <div key={row} className="p-4 grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-hairline bg-canvas-soft/40 p-5 rounded-xs space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-hairline">
              <Skeleton className="h-4.5 w-24" />
              <div className="flex -space-x-2">
                <Skeleton className="h-6 w-6 rounded-full border border-canvas" />
                <Skeleton className="h-6 w-6 rounded-full border border-canvas" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
