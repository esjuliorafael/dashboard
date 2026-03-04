import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Pagado', value: 24, color: '#15803d' }, // green-700
  { name: 'Pendiente', value: 8, color: '#b45309' }, // amber-700
  { name: 'Cancelado', value: 3, color: '#be123c' }, // rose-700
];

const totalOrders = data.reduce((acc, curr) => acc + curr.value, 0);

export const OrderStatusChart: React.FC = () => {
  return (
    // ESTÁNDAR: rounded-[2.5rem], border-stone-200
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
       <div className="flex flex-col mb-4">
        <h3 className="text-lg font-black text-stone-700 tracking-tight">Estado de Órdenes</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-black text-stone-800 tracking-tighter">{totalOrders}</span>
          <span className="text-sm text-stone-400 font-bold uppercase tracking-widest">totales</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 w-fit mt-3">
          <TrendingUp size={14} />
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
               contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
               itemStyle={{ fontWeight: 700, fontSize: '12px' }}
               formatter={(value: number) => [value, 'Órdenes']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-stone-700">{totalOrders}</span>
        </div>
      </div>

      {/* Detailed Legend */}
      <div className="flex flex-col gap-3 mt-4 border-t border-stone-100 pt-5">
        {data.map((item) => {
          const percentage = ((item.value / totalOrders) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-stone-600 font-bold text-xs uppercase tracking-wider">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-stone-800 font-black">{item.value}</span>
                <span className="text-stone-400 text-[10px] font-bold w-10 text-right">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};