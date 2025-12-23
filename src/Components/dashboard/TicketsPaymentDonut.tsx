import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TicketsPaymentDonutProps {
  paidPercentage: number;
  unpaidPercentage: number;
  totalPaid: number;
  totalUnpaid: number;
}

export const TicketsPaymentDonut: React.FC<TicketsPaymentDonutProps> = ({
  paidPercentage,
  unpaidPercentage,
  totalPaid,
  totalUnpaid,
}) => {
  const { t } = useTranslation();

  const data = [
    { name: t('dashboard.status.paid'), value: totalPaid, percentage: paidPercentage, color: '#10b981' },
    { name: t('dashboard.status.unpaid'), value: totalUnpaid, percentage: unpaidPercentage, color: '#f59e0b' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">💳 {t('dashboard.charts.ticketsPayment')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={false}
          >
            {data.map((entry, index) => (
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
            formatter={(value: number | undefined, name: string, props: any) => [
              `${value || 0} ${t('dashboard.charts.tickets')} (${props.payload.percentage.toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold fill-green-600 dark:fill-green-400"
          >
            {paidPercentage.toFixed(0)}%
          </text>
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-gray-500 dark:fill-gray-400"
          >
            {t('dashboard.status.paid')}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
