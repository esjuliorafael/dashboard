import React, { useMemo } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesChart: React.FC = () => {
  // Generate data for the last 7 days ending today
  const data = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const today = new Date();
    const result = [];
    
    // Mock values simulating realistic data variation
    const values = [3500, 5200, 4100, 2800, 6300, 4900, 7550];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push({
        name: days[d.getDay()],
        value: values[6 - i], // Map values chronologically
        isToday: i === 0
      });
    }
    return result;
  }, []);

  return (
    <div className="w-full h-full min-h-[250px] flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-stone-500 text-sm font-medium uppercase tracking-wider">Ventas Totales (Últimos 7 días)</h3>
        <p className="text-2xl font-bold text-stone-800 mt-1">$34,350.00 MXN</p>
      </div>
      
      <div className="flex-grow w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a8a29e', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a8a29e', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#b47e74', fontWeight: 600 }}
              formatter={(value: number) => [`$${value}`, 'Ventas']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isToday ? '#b47e74' : '#eadad6'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};