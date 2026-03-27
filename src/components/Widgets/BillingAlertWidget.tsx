import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { AnnualService, ExtraCharge } from '../../types';

interface BillingAlertWidgetProps {
  services: AnnualService[];
  charges: ExtraCharge[];
  onNavigate: () => void;
}

export const BillingAlertWidget: React.FC<BillingAlertWidgetProps> = ({ services, charges, onNavigate }) => {
  const totalPendingFixed = services.filter(s => !s.isPaid).reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendingExtra = charges.filter(c => c.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const granTotalPending = totalPendingFixed + totalPendingExtra;

  const unpaidServices = services.filter(s => !s.isPaid && s.dueDate);
  const nextDueDate = unpaidServices.length > 0 
    ? unpaidServices.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0].dueDate 
    : null;

  // Formato: YYYY-MM-DD -> DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Si no hay deuda pendiente, no mostramos absolutamente NADA (no es invasivo)
  if (granTotalPending === 0) {
    return null;
  }

  // Homologado exactamente con el banner de BillingView.tsx
  return (
    <div 
      onClick={onNavigate}
      className="bg-stone-900 p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl text-white transition-all duration-500 cursor-pointer hover:bg-stone-800 hover:shadow-2xl group active:scale-[0.98]"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 bg-stone-800 text-brand-400 group-hover:bg-stone-700 transition-colors">
          <AlertCircle size={32} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Saldo Total Pendiente
          </h4>
          <p className="text-4xl sm:text-5xl font-black mt-1 tracking-tighter">
            ${granTotalPending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        {nextDueDate && (
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-left sm:text-right w-full sm:w-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Próximo Vencimiento</p>
            <p className="text-lg font-bold text-white mt-1">{formatDate(nextDueDate)}</p>
          </div>
        )}
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors shrink-0">
          <ChevronRight size={24} className="text-stone-400 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
};