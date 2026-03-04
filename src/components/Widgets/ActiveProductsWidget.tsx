import React from 'react';
import { Package } from 'lucide-react';

export const ActiveProductsWidget: React.FC = () => {
  return (
    // ESTÁNDAR: rounded-[2.5rem], border-stone-200
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow group h-full">
      <div className="flex justify-between items-start">
        {/* Icono: rounded-2xl */}
        <div className="p-3.5 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100 group-hover:scale-110 transition-transform">
          <Package size={24} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-wider">STOCK</span>
      </div>
      <div>
        <h4 className="text-3xl font-black text-stone-800 mt-4 tracking-tight">142</h4>
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">Productos Activos</p>
      </div>
    </div>
  );
};