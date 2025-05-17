import React from "react";

export default function Loading() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
