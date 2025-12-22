import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-gray-900/30 p-6 relative overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300"
    >
      {/* Background Gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10 rounded-full blur-3xl"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</div>
          <div className="text-3xl">{icon}</div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold dark:text-white" style={{ color }}>
              {value}
            </div>
            {subtitle && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>
            )}
          </div>
          
          {trend && (
            <div
              className={clsx(
                'flex items-center text-xs font-semibold px-2 py-1 rounded-full',
                trend.isPositive
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
