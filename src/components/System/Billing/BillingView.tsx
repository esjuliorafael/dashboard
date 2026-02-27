import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { Server, Globe, Wrench, Receipt, Plus, Trash2, CheckCircle2, AlertCircle, Info, DollarSign, Tag, Calendar as CalendarIcon, Pencil, X, Save, Check } from 'lucide-react';

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

export const BillingView = forwardRef<BillingViewRef, BillingViewProps>(
  ({ showToast }, ref) => {
    
    // Estado de los servicios fijos
    const [services, setServices] = useState({
      domain: { cost: 727.32, isPaid: false },
      hosting: { cost: 3274.59, isPaid: false },
      maintenance: { cost: 3500.00, isPaid: false }
    });

    // Estado para los cargos extra (iniciando con la deuda de desarrollo)
    const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([
      {
        id: 'dev-1',
        concept: 'Saldo Pendiente: Desarrollo del Sistema',
        amount: 10000.00,
        status: 'pending',
        date: '2023-10-25'
      }
    ]);

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCharge, setEditingCharge] = useState<ExtraCharge | null>(null);
    const [chargeFormData, setChargeFormData] = useState({ concept: '', amount: '' });

    useImperativeHandle(ref, () => ({
      handleSaveConfig: () => {
        showToast('Estado de cuenta y servicios actualizados correctamente', 'success');
      }
    }));

    const handleOpenNewModal = () => {
      setEditingCharge(null);
      setChargeFormData({ concept: '', amount: '' });
      setIsModalOpen(true);
    };

    const handleEditClick = (charge: ExtraCharge) => {
      setEditingCharge(charge);
      setChargeFormData({ concept: charge.concept, amount: charge.amount.toString() });
      setIsModalOpen(true);
    };

    const handleSaveCharge = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!chargeFormData.concept.trim() || !chargeFormData.amount) {
        showToast('Por favor completa el concepto y el monto.', 'error');
        return;
      }
      
      if (editingCharge) {
        setExtraCharges(prev => prev.map(c => 
          c.id === editingCharge.id ? { ...c, concept: chargeFormData.concept, amount: parseFloat(chargeFormData.amount) } : c
        ));
        showToast('Cargo actualizado correctamente');
      } else {
        const charge: ExtraCharge = {
          id: `charge-${Date.now()}`,
          concept: chargeFormData.concept,
          amount: parseFloat(chargeFormData.amount),
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        };
        setExtraCharges([charge, ...extraCharges]);
        showToast('Cargo extra añadido a la cuenta');
      }
      setIsModalOpen(false);
    };

    const removeCharge = (id: string) => {
      setExtraCharges(prev => prev.filter(c => c.id !== id));
      showToast('Cargo eliminado');
    };

    const toggleChargeStatus = (id: string) => {
      setExtraCharges(prev => prev.map(c => 
        c.id === id ? { ...c, status: c.status === 'pending' ? 'paid' : 'pending' } : c
      ));
    };

    // Cálculos de totales
    const totalFixed = services.domain.cost + services.hosting.cost + services.maintenance.cost;
    const totalExtra = extraCharges.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPendingFixed = 
      (!services.domain.isPaid ? services.domain.cost : 0) +
      (!services.hosting.isPaid ? services.hosting.cost : 0) +
      (!services.maintenance.isPaid ? services.maintenance.cost : 0);
    const totalPendingExtra = extraCharges.filter(c => c.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const granTotalPending = totalPendingFixed + totalPendingExtra;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-12">
        
        {/* Banner de Resumen (Lo que el cliente debe ver primero) */}
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
          {granTotalPending > 0 && (
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-right w-full sm:w-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Próximo Vencimiento</p>
              <p className="text-lg font-bold text-white mt-1">17 / Sep / 2026</p>
            </div>
          )}
        </div>

        {/* Módulo de Servicios Fijos (Dominio, Hosting, Admin) */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
              <Server size={20} />
            </div>
            <div>
              <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm leading-tight">Servicios Anuales</h3>
              <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Infraestructura y Mantenimiento del Sistema</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* DOMINIO */}
            <div className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${services.domain.isPaid ? 'bg-stone-50 border-stone-100' : 'bg-white border-brand-200 shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${services.domain.isPaid ? 'bg-stone-200 text-stone-500' : 'bg-brand-50 text-brand-500'}`}>
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Dominio (rancholastrojes.com.mx)</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Contratado: 17/09/2025</span>
                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                    <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Vence: 17/09/2026</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Renovación</p>
                  <p className="text-xl font-black text-stone-800">${services.domain.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                </div>
                <button 
                  onClick={() => setServices(prev => ({ ...prev, domain: { ...prev.domain, isPaid: !prev.domain.isPaid } }))}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${services.domain.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  {services.domain.isPaid ? 'Pagado' : 'Marcar Pagado'}
                </button>
              </div>
            </div>

            {/* HOSTING */}
            <div className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${services.hosting.isPaid ? 'bg-stone-50 border-stone-100' : 'bg-white border-brand-200 shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${services.hosting.isPaid ? 'bg-stone-200 text-stone-500' : 'bg-brand-50 text-brand-500'}`}>
                  <Server size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Hosting (Servidor Dedicado)</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Contratado: 17/09/2025</span>
                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                    <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Vence: 17/09/2026</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Renovación</p>
                  <p className="text-xl font-black text-stone-800">${services.hosting.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                </div>
                <button 
                  onClick={() => setServices(prev => ({ ...prev, hosting: { ...prev.hosting, isPaid: !prev.hosting.isPaid } }))}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${services.hosting.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  {services.hosting.isPaid ? 'Pagado' : 'Marcar Pagado'}
                </button>
              </div>
            </div>

            {/* MANTENIMIENTO */}
            <div className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${services.maintenance.isPaid ? 'bg-stone-50 border-stone-100' : 'bg-white border-brand-200 shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${services.maintenance.isPaid ? 'bg-stone-200 text-stone-500' : 'bg-brand-50 text-brand-500'}`}>
                  <Wrench size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Administración y Mantenimiento</h4>
                  <p className="text-xs font-medium text-stone-500 mt-1.5 leading-relaxed max-w-md">
                    Respaldo de bases de datos, actualizaciones de seguridad, monitoreo 24/7 y soporte técnico general.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Anualidad</p>
                  <p className="text-xl font-black text-stone-800">${services.maintenance.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                </div>
                <button 
                  onClick={() => setServices(prev => ({ ...prev, maintenance: { ...prev.maintenance, isPaid: !prev.maintenance.isPaid } }))}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${services.maintenance.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  {services.maintenance.isPaid ? 'Pagado' : 'Marcar Pagado'}
                </button>
              </div>
            </div>
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
              onClick={handleOpenNewModal}
              className="flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-stone-800 transition-all active:scale-95"
            >
              <Plus size={16} />
              Añadir Cargo
            </button>
          </div>

          {/* Lista de Cargos Extra */}
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
                      <p className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">Añadido el: {new Date(charge.date).toLocaleDateString('es-MX')}</p>
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
                      <button 
                        onClick={() => handleEditClick(charge)}
                        className="p-2 text-stone-300 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"
                        title="Editar cargo"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => removeCharge(charge.id)}
                        className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Eliminar cargo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                    {editingCharge ? 'Editar Cargo' : 'Nuevo Cargo'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveCharge} className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Concepto del Cargo</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none">
                          <Tag size={18} />
                        </span>
                        <input 
                          type="text"
                          required
                          value={chargeFormData.concept}
                          onChange={(e) => setChargeFormData({ ...chargeFormData, concept: e.target.value })}
                          placeholder="Ej. Fotografía de Productos..."
                          className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Monto (MXN)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center justify-center text-stone-400 group-focus-within:text-brand-500 transition-colors pointer-events-none">
                          <DollarSign size={18} />
                        </span>
                        <input 
                          type="number"
                          required
                          min="1"
                          step="0.01"
                          value={chargeFormData.amount}
                          onChange={(e) => setChargeFormData({ ...chargeFormData, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-stone-50 text-stone-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all active:scale-[0.98] border border-stone-200/50"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={!(chargeFormData.concept.trim() && chargeFormData.amount)}
                      className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2
                        ${!(chargeFormData.concept.trim() && chargeFormData.amount) ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600'}
                      `}
                    >
                      {editingCharge ? <Save size={16} strokeWidth={3} /> : <Check size={16} strokeWidth={3} />}
                      {editingCharge ? 'Guardar Cambios' : 'Añadir Cargo'}
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