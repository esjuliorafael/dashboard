import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const PaidOrdersWidget: React.FC = () => {
  return (
    // ESTÁNDAR: rounded-[2.5rem], border-stone-200
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow group h-full">
      <div className="flex justify-between items-start">
        {/* Icono: rounded-2xl */}
        <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl border border-green-100 group-hover:scale-110 transition-transform">
          <CheckCircle2 size={24} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100 uppercase tracking-wider">68.6%</span>
      </div>
      <div>
        <h4 className="text-3xl font-black text-stone-800 mt-4 tracking-tight">$128k</h4>
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">Ingresos Totales</p>
      </div>
    </div>
  );
};