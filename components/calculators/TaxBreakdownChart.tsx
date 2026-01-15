'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TaxBreakdown } from '@/lib/types';

interface Props {
  breakdown: TaxBreakdown[];
  currency: string;
}

export default function TaxBreakdownChart({ breakdown, currency }: Props) {
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const data = breakdown.map((item) => ({
    name: item.label,
    value: item.amount,
    color: item.color
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Visual Breakdown</h3>
      <div className="w-full h-64 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '8px',
                fontSize: '12px'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => <span className="text-xs font-medium text-gray-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
