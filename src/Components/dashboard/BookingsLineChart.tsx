import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BookingsLineChartProps {
  data: Array<{ month: string; value: number }>;
}

export const BookingsLineChart: React.FC<BookingsLineChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📅 Réservations sur 6 mois</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => value.split(' ')[0]}
          />
          <YAxis stroke="#6b7280" className="dark:stroke-gray-400" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: '1px solid rgb(55 65 81)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#93c5fd' }}
          />
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
          <Line
            type="monotone"
            dataKey="value"
            name="Réservations"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
