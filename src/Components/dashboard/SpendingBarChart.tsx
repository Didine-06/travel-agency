import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface SpendingBarChartProps {
  data: Array<{ month: string; amount: number }>;
}

export const SpendingBarChart: React.FC<SpendingBarChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">💰 Dépenses sur 6 mois</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.6} />
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
          <YAxis
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: '1px solid rgb(55 65 81)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#93c5fd' }}
            formatter={(value: number) => [formatCurrency(value), 'Dépenses']}
          />
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
          <Bar
            dataKey="amount"
            name="Dépenses"
            fill="url(#colorSpending)"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
