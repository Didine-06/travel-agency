import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BookingsStatusDonutProps {
  data: Array<{ status: string; count: number; percentage: number }>;
}

export const BookingsStatusDonut: React.FC<BookingsStatusDonutProps> = ({ data }) => {
  const { t } = useTranslation();

  const STATUS_CONFIG = {
    PENDING: { color: '#f59e0b', label: t('dashboard.status.pending') },
    CONFIRMED: { color: '#10b981', label: t('dashboard.status.confirmed') },
    COMPLETED: { color: '#2563eb', label: t('dashboard.status.completed') },
    CANCELLED: { color: '#ef4444', label: t('dashboard.status.cancelled') },
  };

  const chartData = data.map((item) => ({
    name:
      STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.label || item.status,
    value: item.count,
    percentage: item.percentage,
    color: STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.color,
  }));

  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📊 {t('dashboard.charts.bookingsStatus')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ percentage }) => `${percentage.toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: '1px solid rgb(55 65 81)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#93c5fd' }}
            formatter={(value: number, name: string, props: any) => [
              `${value} réservations (${props.payload.percentage.toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold fill-gray-700 dark:fill-gray-300"
          >
            {totalBookings}
          </text>
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-500 dark:fill-gray-400"
          >
            {t('dashboard.charts.total')}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
