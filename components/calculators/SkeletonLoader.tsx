'use client';

import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid md:grid-cols-3 gap-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="bg-gray-200 rounded-xl shadow-lg p-6 h-32"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
          >
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </motion.div>
        ))}
      </div>

      {/* Table Skeleton */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      >
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chart Skeleton */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center justify-center h-96"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
      >
        <div className="w-64 h-64 bg-gray-200 rounded-full"></div>
      </motion.div>
    </div>
  );
}
