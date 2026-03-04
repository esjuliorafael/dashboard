import React from 'react';
import { Clock } from 'lucide-react';

export const PendingOrdersWidget: React.FC = () => {
  return (
    // ESTRUCTURA GEMELA: bg-white, rounded-[2.5rem], border-stone-200
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow group h-full">
      
      {/* Parte Superior: Icono y Badge alineados igual que en Pagadas */}
      <div className="flex justify-between items-start">
        {/* Icono: Amber en lugar de Green */}
        <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 group-hover:scale-110 transition-transform">
          <Clock size={24} strokeWidth={1.5} />
        </div>
        
        {/* Badge: Estilo pastilla igual al vecino */}
        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 uppercase tracking-wider">
          22.9%
        </span>
      </div>

      {/* Parte Inferior: Cifras */}
      <div>
        <h4 className="text-3xl font-black text-stone-800 mt-4 tracking-tight">$42.5k</h4>
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">Saldo por Cobrar</p>
      </div>
    </div>
  );
};