import React from 'react';
import { Tags, ChevronRight } from 'lucide-react';

export const CategoryWidget: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-200 flex flex-col justify-center hover:shadow-md transition-shadow duration-200 flex-1 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-500 rounded-2xl shrink-0">
            <Tags size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest leading-none">Categorías</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <h3 className="text-xl font-black text-stone-800 leading-none">{count}</h3>
              <span className="text-stone-400 text-[9px] font-medium uppercase leading-none">Activas</span>
            </div>
          </div>
        </div>
        <button className="text-stone-300 hover:text-rose-500 transition-colors group p-2 rounded-full hover:bg-rose-50 shrink-0">
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};