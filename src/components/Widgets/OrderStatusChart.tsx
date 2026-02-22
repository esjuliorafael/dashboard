import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Pagado', value: 24, color: '#15803d' }, // green-700
  { name: 'Pendiente', value: 8, color: '#b45309' }, // amber-700
  { name: 'Cancelado', value: 3, color: '#b91c1c' }, // red-700
];

const totalOrders = data.reduce((acc, curr) => acc + curr.value, 0);

export const OrderStatusChart: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-6 shadow-sm border border-white/60">
       <div className="flex flex-col mb-2">
        <h3 className="text-lg font-bold text-stone-700">Estado de Órdenes</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-stone-800">{totalOrders}</span>
          <span className="text-sm text-stone-500 font-medium">totales</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit mt-2">
          <TrendingUp size={12} />
          <span>+15% vs semana anterior</span>
        </div>
      </div>
      
      <div className="flex-grow w-full relative min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
               itemStyle={{ fontWeight: 600 }}
               formatter={(value: number) => [value, 'Órdenes']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-stone-700">{totalOrders}</span>
        </div>
      </div>

      {/* Detailed Legend */}
      <div className="flex flex-col gap-3 mt-2 border-t border-stone-100 pt-4">
        {data.map((item) => {
          const percentage = ((item.value / totalOrders) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-stone-600 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-stone-800 font-bold">{item.value}</span>
                <span className="text-stone-400 text-xs w-10 text-right">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};