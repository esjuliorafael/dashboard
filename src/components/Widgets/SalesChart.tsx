import React, { useMemo } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SalesChartProps {
  data?: Record<string, number>;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data = {} }) => {
  const chartData = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const today = new Date();
    const result = [];

    // Recorremos los últimos 7 días (incluyendo hoy)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      // Formateamos la fecha a YYYY-MM-DD usando la zona horaria local
      const dateString = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      
      result.push({
        name: days[d.getDay()],
        value: Number(data[dateString] || 0), // Casting a Number
        isToday: i === 0
      });
    }
    return result;
  }, [data]);

  // Sumamos el total de los 7 días. Extraemos los valores como un arreglo de números
  const valuesArray: number[] = Object.values(data) as number[];
  const totalVentas: number = valuesArray.reduce((acc: number, val: number) => acc + val, 0);

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
        <span className="text-4xl font-black text-stone-800 tracking-tighter">
          ${Number(totalVentas).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-sm font-bold text-stone-400">MXN</span>
      </div>

      <div className="flex-grow w-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
              tickFormatter={(value) => value > 0 ? `$${value}` : '0'}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#ea580c', fontWeight: 700, fontSize: '12px' }}
              formatter={(value: number) => [`$${Number(value).toLocaleString('es-MX')}`, 'Ventas']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
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