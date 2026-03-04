import React, { useMemo } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const SalesChart: React.FC = () => {
  const data = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const today = new Date();
    const result = [];
    const values = [3500, 5200, 4100, 2800, 6300, 4900, 7550];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push({
        name: days[d.getDay()],
        value: values[6 - i],
        isToday: i === 0
      });
    }
    return result;
  }, []);

  return (
    // ESTÁNDAR: rounded-[2.5rem], border-stone-200
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200 flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-stone-800 text-lg font-black tracking-tight">Ventas Totales</h3>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Últimos 7 días</p>
        </div>
        {/* Icono: rounded-2xl */}
        <div className="p-2.5 bg-green-50 text-green-600 rounded-2xl border border-green-100">
          <TrendingUp size={20} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-black text-stone-800 tracking-tighter">$34,350</span>
        <span className="text-sm font-bold text-stone-400">MXN</span>
      </div>

      <div className="flex-grow w-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#ea580c', fontWeight: 700, fontSize: '12px' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ventas']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isToday ? '#ea580c' : '#e5e5e5'} 
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};