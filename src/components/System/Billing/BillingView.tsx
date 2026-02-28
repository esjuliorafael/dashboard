import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { Server, Globe, Wrench, Receipt, Plus, Trash2, CheckCircle2, AlertCircle, Info, DollarSign, Tag, Calendar as CalendarIcon, Pencil, X, Save, Check, ShieldCheck, Box, FileText } from 'lucide-react';

export interface BillingViewRef {
  handleSaveConfig: () => void;
}

interface BillingViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

interface ExtraCharge {
  id: string;
  concept: string;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
}

interface AnnualService {
  id: string;
  concept: string;
  description: string;
  amount: number;
  isPaid: boolean;
  contractDate: string;
  dueDate: string;
  iconType: 'globe' | 'server' | 'wrench' | 'shield' | 'default';
}

export const BillingView = forwardRef<BillingViewRef, BillingViewProps>(
  ({ showToast }, ref) => {
    
    // Estado dinámico para los servicios fijos (Ahora escalable a futuro)
    const [services, setServices] = useState<AnnualService[]>([
      {
        id: 'srv-domain', concept: 'Dominio (rancholastrojes.com.mx)', description: '',
        amount: 727.32, isPaid: false, contractDate: '2025-09-17', dueDate: '2026-09-17', iconType: 'globe'
      },
      {
        id: 'srv-hosting', concept: 'Hosting (Servidor Dedicado)', description: '',
        amount: 3274.59, isPaid: false, contractDate: '2025-09-17', dueDate: '2026-09-17', iconType: 'server'
      },
      {
        id: 'srv-maintenance', concept: 'Administración y Mantenimiento', description: 'Respaldo de bases de datos, actualizaciones de seguridad, monitoreo 24/7 y soporte técnico general.',
        amount: 3500.00, isPaid: false, contractDate: '2025-09-17', dueDate: '2026-09-17', iconType: 'wrench'
      },
      {
        id: 'srv-ssl', concept: 'Certificado de Seguridad SSL', description: 'Cifrado de datos y candado de seguridad obligatorio para pasarelas de pago y confianza del cliente.',
        amount: 350.00, isPaid: false, contractDate: '2025-09-17', dueDate: '2026-09-17', iconType: 'shield'
      }
    ]);

    // Estado para los cargos extra
    const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([
      {
        id: 'dev-1', concept: 'Saldo Pendiente: Desarrollo del Sistema', amount: 10000.00,
        status: 'pending', date: '2025-10-25'
      }
    ]);

    // Estados para Modales
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [editingCharge, setEditingCharge] = useState<ExtraCharge | null>(null);
    const [chargeFormData, setChargeFormData] = useState({ concept: '', amount: '' });

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<AnnualService | null>(null);
    const [serviceFormData, setServiceFormData] = useState({ concept: '', description: '', amount: '', contractDate: '', dueDate: '' });

    useImperativeHandle(ref, () => ({
      handleSaveConfig: () => {
        showToast('Estado de cuenta y servicios actualizados correctamente', 'success');
      }
    }));

    // --- LÓGICA DE CARGOS EXTRA ---
    const handleOpenChargeModal = (charge?: ExtraCharge) => {
      if (charge) {
        setEditingCharge(charge);
        setChargeFormData({ concept: charge.concept, amount: charge.amount.toString() });
      } else {
        setEditingCharge(null);
        setChargeFormData({ concept: '', amount: '' });
      }
      setIsChargeModalOpen(true);
    };

    const handleSaveCharge = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chargeFormData.concept.trim() || !chargeFormData.amount) return;
      
      if (editingCharge) {
        setExtraCharges(prev => prev.map(c => 
          c.id === editingCharge.id ? { ...c, concept: chargeFormData.concept, amount: parseFloat(chargeFormData.amount) } : c
        ));
        showToast('Cargo actualizado correctamente');
      } else {
        const newCharge: ExtraCharge = {
          id: `charge-${Date.now()}`,
          concept: chargeFormData.concept,
          amount: parseFloat(chargeFormData.amount),
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        };
        setExtraCharges([newCharge, ...extraCharges]);
        showToast('Cargo extra añadido a la cuenta');
      }
      setIsChargeModalOpen(false);
    };

    const removeCharge = (id: string) => {
      setExtraCharges(prev => prev.filter(c => c.id !== id));
      showToast('Cargo eliminado');
    };

    const toggleChargeStatus = (id: string) => {
      setExtraCharges(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'pending' ? 'paid' : 'pending' } : c));
    };

    // --- LÓGICA DE SERVICIOS ANUALES ---
    const handleOpenServiceModal = (service?: AnnualService) => {
      if (service) {
        setEditingService(service);
        setServiceFormData({ 
          concept: service.concept, description: service.description, amount: service.amount.toString(), 
          contractDate: service.contractDate, dueDate: service.dueDate 
        });
      } else {
        setEditingService(null);
        setServiceFormData({ concept: '', description: '', amount: '', contractDate: '', dueDate: '' });
      }
      setIsServiceModalOpen(true);
    };

    const handleSaveService = (e: React.FormEvent) => {
      e.preventDefault();
      if (!serviceFormData.concept.trim() || !serviceFormData.amount) return;
      
      if (editingService) {
        setServices(prev => prev.map(s => 
          s.id === editingService.id ? { 
            ...s, concept: serviceFormData.concept, description: serviceFormData.description, 
            amount: parseFloat(serviceFormData.amount), contractDate: serviceFormData.contractDate, dueDate: serviceFormData.dueDate 
          } : s
        ));
        showToast('Servicio actualizado correctamente');
      } else {
        const newService: AnnualService = {
          id: `srv-${Date.now()}`,
          concept: serviceFormData.concept, description: serviceFormData.description, amount: parseFloat(serviceFormData.amount),
          isPaid: false, contractDate: serviceFormData.contractDate, dueDate: serviceFormData.dueDate, iconType: 'default'
        };
        setServices([...services, newService]);
        showToast('Servicio anual añadido');
      }
      setIsServiceModalOpen(false);
    };

    const removeService = (id: string) => {
      setServices(prev => prev.filter(s => s.id !== id));
      showToast('Servicio eliminado');
    };

    const toggleServiceStatus = (id: string) => {
      setServices(prev => prev.map(s => s.id === id ? { ...s, isPaid: !s.isPaid } : s));
    };

    // --- RENDERIZADO DE ICONOS DINÁMICOS ---
    const renderServiceIcon = (type: string, isPaid: boolean) => {
      let IconComponent = Box;
      if (type === 'globe') IconComponent = Globe;
      if (type === 'server') IconComponent = Server;
      if (type === 'wrench') IconComponent = Wrench;
      if (type === 'shield') IconComponent = ShieldCheck;
      
      return (
        <div className={`p-3 rounded-2xl ${isPaid ? 'bg-stone-200 text-stone-500' : 'bg-brand-50 text-brand-500'}`}>
          <IconComponent size={24} />
        </div>
      );
    };

    // --- CÁLCULOS Y FORMATEO ---
    const totalPendingFixed = services.filter(s => !s.isPaid).reduce((acc, curr) => acc + curr.amount, 0);
    const totalPendingExtra = extraCharges.filter(c => c.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const granTotalPending = totalPendingFixed + totalPendingExtra;

    // Cálculo dinámico de la fecha más cercana a vencer
    const unpaidServices = services.filter(s => !s.isPaid && s.dueDate);
    const nextDueDate = unpaidServices.length > 0 
      ? unpaidServices.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0].dueDate 
      : null;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-12">
        
        {/* Banner de Resumen */}
        <div className={`p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl text-white transition-all duration-500
          ${granTotalPending > 0 ? 'bg-stone-900' : 'bg-green-600'}
        `}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0
              ${granTotalPending > 0 ? 'bg-stone-800 text-brand-400' : 'bg-green-500 text-white'}
            `}>
              {granTotalPending > 0 ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest ${granTotalPending > 0 ? 'text-stone-400' : 'text-green-200'}`}>
                {granTotalPending > 0 ? 'Saldo Total Pendiente' : 'Cuenta al Día'}
              </h4>
              <p className="text-4xl sm:text-5xl font-black mt-1 tracking-tighter">
                ${granTotalPending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          {granTotalPending > 0 && nextDueDate && (
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-right w-full sm:w-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Próximo Vencimiento</p>
              <p className="text-lg font-bold text-white mt-1">{formatDate(nextDueDate)}</p>
            </div>
          )}
        </div>

        {/* Módulo de Servicios Fijos */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-stone-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
                <Server size={20} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm leading-tight">Servicios Anuales</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Infraestructura y Mantenimiento del Sistema</p>
              </div>
            </div>

            <button 
              onClick={() => handleOpenServiceModal()}
              className="flex items-center justify-center gap-2 bg-stone-50 text-stone-600 px-5 py-3 rounded-2xl text-xs font-bold hover:bg-stone-100 border border-stone-200 transition-all active:scale-95"
            >
              <Plus size={16} />
              Añadir Servicio
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {services.map((service) => (
              <div key={service.id} className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${service.isPaid ? 'bg-stone-50 border-stone-100' : 'bg-white border-brand-200 shadow-sm'}`}>
                <div className="flex items-start gap-4">
                  {renderServiceIcon(service.iconType, service.isPaid)}
                  <div>
                    <h4 className={`font-bold ${service.isPaid ? 'text-stone-500' : 'text-stone-800'}`}>{service.concept}</h4>
                    {service.description && (
                      <p className="text-xs font-medium text-stone-500 mt-1.5 leading-relaxed max-w-md">
                        {service.description}
                      </p>
                    )}
                    {(service.contractDate || service.dueDate) && (
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        {service.contractDate && <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Contratado: {formatDate(service.contractDate)}</span>}
                        {service.contractDate && service.dueDate && <span className="w-1 h-1 rounded-full bg-stone-300"></span>}
                        {service.dueDate && <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Vence: {formatDate(service.dueDate)}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Renovación</p>
                    <p className={`text-xl font-black ${service.isPaid ? 'text-stone-400' : 'text-stone-800'}`}>${service.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${service.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                    >
                      {service.isPaid ? 'Pagado' : 'Marcar Pagado'}
                    </button>
                    <button onClick={() => handleOpenServiceModal(service)} className="p-2 text-stone-300 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"><Pencil size={18} /></button>
                    <button onClick={() => removeService(service.id)} className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Módulo de Cargos Adicionales */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-stone-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
                <Receipt size={20} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm leading-tight">Cargos Adicionales</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Saldos pendientes, desarrollo o extras</p>
              </div>
            </div>

            <button 
              onClick={() => handleOpenChargeModal()}
              className="flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-stone-800 transition-all active:scale-95"
            >
              <Plus size={16} />
              Añadir Cargo
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {extraCharges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-bold text-stone-400">No hay cargos adicionales registrados.</p>
              </div>
            ) : (
              extraCharges.map((charge) => (
                <div key={charge.id} className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${charge.status === 'paid' ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-200 shadow-sm'}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${charge.status === 'paid' ? 'text-stone-500 line-through' : 'text-stone-800'}`}>{charge.concept}</h4>
                      <p className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">Añadido el: {formatDate(charge.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:ml-auto w-full md:w-auto">
                    <p className={`text-lg font-black ${charge.status === 'paid' ? 'text-stone-400' : 'text-stone-800'}`}>
                      ${charge.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="w-px h-8 bg-stone-200 mx-2 hidden md:block"></div>
                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                      <button 
                        onClick={() => toggleChargeStatus(charge.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${charge.status === 'paid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                      >
                        {charge.status === 'paid' ? 'Pagado' : 'Marcar Pagado'}
                      </button>
                      <button onClick={() => handleOpenChargeModal(charge)} className="p-2 text-stone-300 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"><Pencil size={18} /></button>
                      <button onClick={() => removeCharge(charge.id)} className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal: Servicio Anual */}
        {isServiceModalOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsServiceModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                    {editingService ? 'Editar Servicio' : 'Nuevo Servicio Anual'}
                  </h3>
                  <button onClick={() => setIsServiceModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveService} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Concepto del Servicio</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"><Tag size={18} /></span>
                        <input type="text" required value={serviceFormData.concept} onChange={(e) => setServiceFormData({ ...serviceFormData, concept: e.target.value })} placeholder="Ej. Licencia de Plugins..." className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Descripción (Opcional)</label>
                      <div className="relative">
                        <span className="absolute top-5 left-4 flex items-start justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"><FileText size={18} /></span>
                        <textarea rows={2} value={serviceFormData.description} onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })} placeholder="Detalles de lo que incluye..." className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm resize-none" />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Monto (MXN)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"><DollarSign size={18} /></span>
                        <input type="number" required min="1" step="0.01" value={serviceFormData.amount} onChange={(e) => setServiceFormData({ ...serviceFormData, amount: e.target.value })} placeholder="0.00" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group space-y-2">
                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Contratado</label>
                        <input type="date" value={serviceFormData.contractDate} onChange={(e) => setServiceFormData({ ...serviceFormData, contractDate: e.target.value })} className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl p-4 outline-none transition-all font-bold text-stone-700 shadow-sm text-sm" />
                      </div>
                      <div className="group space-y-2">
                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Vence</label>
                        <input type="date" value={serviceFormData.dueDate} onChange={(e) => setServiceFormData({ ...serviceFormData, dueDate: e.target.value })} className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl p-4 outline-none transition-all font-bold text-stone-700 shadow-sm text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-4 bg-stone-50 text-stone-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all border border-stone-200/50">Cancelar</button>
                    <button type="submit" disabled={!(serviceFormData.concept.trim() && serviceFormData.amount)} className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!(serviceFormData.concept.trim() && serviceFormData.amount) ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-brand-500 text-white shadow-lg hover:bg-brand-600'}`}>
                      {editingService ? <Save size={16} strokeWidth={3} /> : <Check size={16} strokeWidth={3} />} {editingService ? 'Guardar' : 'Añadir'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        , document.body)}

        {/* Modal: Cargo Extra */}
        {isChargeModalOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsChargeModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                    {editingCharge ? 'Editar Cargo' : 'Nuevo Cargo'}
                  </h3>
                  <button onClick={() => setIsChargeModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveCharge} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Concepto del Cargo</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"><Tag size={18} /></span>
                        <input type="text" required value={chargeFormData.concept} onChange={(e) => setChargeFormData({ ...chargeFormData, concept: e.target.value })} placeholder="Ej. Fotografía de Productos..." className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Monto (MXN)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"><DollarSign size={18} /></span>
                        <input type="number" required min="1" step="0.01" value={chargeFormData.amount} onChange={(e) => setChargeFormData({ ...chargeFormData, amount: e.target.value })} placeholder="0.00" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsChargeModalOpen(false)} className="flex-1 py-4 bg-stone-50 text-stone-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all border border-stone-200/50">Cancelar</button>
                    <button type="submit" disabled={!(chargeFormData.concept.trim() && chargeFormData.amount)} className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!(chargeFormData.concept.trim() && chargeFormData.amount) ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-brand-500 text-white shadow-lg hover:bg-brand-600'}`}>
                      {editingCharge ? <Save size={16} strokeWidth={3} /> : <Check size={16} strokeWidth={3} />} {editingCharge ? 'Guardar' : 'Añadir'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        , document.body)}

      </div>
    );
  }
);