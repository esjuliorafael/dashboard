import React from 'react';
import { TrendingUp, DollarSign, Box, Clock, LucideIcon } from 'lucide-react';

// 1. Sub-componente para la tarjeta grande (Productos)
// APLICADO: rounded-[2.5rem] (40px) y border-stone-200
const ActiveProductsCard = () => (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center flex-1 min-h-[160px]">
    <div className="flex items-start justify-between">
      <div>
        <span className="text-stone-500 text-xs font-bold uppercase tracking-widest">Productos Activos</span>
        <h3 className="text-4xl font-black text-stone-800 mt-2">142</h3>
      </div>
      <div className="p-4 bg-brand-50 text-brand-600 rounded-3xl">
        <Box size={28} />
      </div>
    </div>
    <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-3 py-1.5 rounded-xl">
      <TrendingUp size={14} />
      <span>+12 ESTE MES</span>
    </div>
  </div>
);

// 2. Sub-componente REUTILIZABLE para las tarjetas pequeñas
// APLICADO: rounded-3xl (24px) y border-stone-200
interface SmallCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  colorClass: 'green' | 'amber';
  percentage: number;
}

const SmallStatCard = ({ title, value, icon: Icon, trend, colorClass, percentage }: SmallCardProps) => {
  const styles = {
    green: {
      bgIcon: 'bg-green-100', textIcon: 'text-green-600',
      bgTrend: 'bg-green-50', textTrend: 'text-green-600',
      bar: 'bg-green-500'
    },
    amber: {
      bgIcon: 'bg-amber-100', textIcon: 'text-amber-600',
      bgTrend: 'bg-amber-50', textTrend: 'text-amber-600',
      bar: 'bg-amber-500'
    }
  };

  const currentStyle = styles[colorClass];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-2xl ${currentStyle.bgIcon} ${currentStyle.textIcon} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-bold ${currentStyle.textTrend} ${currentStyle.bgTrend} px-2 py-1 rounded-lg`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-2">{title}</p>
        <p className="text-3xl font-black text-stone-800 mb-3">{value}</p>
        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
          <div className={`h-full ${currentStyle.bar} rounded-full`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
};

// 3. Componente Principal
export const StatsOverview = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      <ActiveProductsCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        <SmallStatCard 
          title="Pagadas"
          value="24"
          icon={DollarSign}
          trend="+4%"
          colorClass="green"
          percentage={75}
        />
        
        <SmallStatCard 
          title="Pendientes"
          value="8"
          icon={Clock}
          trend="-2%"
          colorClass="amber"
          percentage={25}
        />
      </div>
    </div>
  );
};