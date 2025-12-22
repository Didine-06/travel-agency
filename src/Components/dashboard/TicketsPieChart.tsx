import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TicketsPieChartProps {
  data: Array<{ class: string; count: number; percentage: number }>;
}

const COLORS = {
  ECONOMY: '#2563eb',
  BUSINESS: '#f59e0b',
  FIRST: '#8b5cf6',
};

const CLASS_LABELS = {
  ECONOMY: 'Économique',
  BUSINESS: 'Affaires',
  FIRST: 'Première classe',
};

export const TicketsPieChart: React.FC<TicketsPieChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: CLASS_LABELS[item.class as keyof typeof CLASS_LABELS] || item.class,
    value: item.count,
    percentage: item.percentage,
  }));

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">✈️ Billets par Classe</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[data[index].class as keyof typeof COLORS]}
              />
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
              `${value} billets (${props.payload.percentage.toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
