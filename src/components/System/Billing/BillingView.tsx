import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Server, Globe, Wrench, Receipt, Plus, Trash2, CheckCircle2, AlertCircle, DollarSign, Tag, Calendar as CalendarIcon, Pencil, X, Save, Check, ShieldCheck, Box, FileText, Edit2 } from 'lucide-react';

export interface BillingViewRef {
  handleSaveConfig: () => void;
}

interface BillingViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
  setConfirmDialog: (dialog: any) => void;
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

// --- UTILIDADES ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const RenderServiceIcon = ({ type, isPaid }: { type: string, isPaid: boolean }) => {
  let IconComponent = Box;
  if (type === 'globe') IconComponent = Globe;
  if (type === 'server') IconComponent = Server;
  if (type === 'wrench') IconComponent = Wrench;
  if (type === 'shield') IconComponent = ShieldCheck;
  
  return (
    <div className={`p-3 rounded-2xl flex-shrink-0 ${isPaid ? 'bg-stone-200 text-stone-500' : 'bg-brand-50 text-brand-500'}`}>
      <IconComponent size={24} />
    </div>
  );
};

// --- COMPONENTES SWIPEABLES ---

interface SwipeableCardProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  children, 
  onEdit, 
  onDelete, 
  className 
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeSide, setActiveSide] = useState<'none' | 'left' | 'right'>('none');
  
  const touchStart = useRef(0);
  const touchX = useRef(0);
  
  const SWIPE_THRESHOLD = 80;
  const ACTION_WIDTH = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchX.current = touchStart.current;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStart.current;
    
    let finalTranslate = diff;
    if (activeSide === 'left') finalTranslate = ACTION_WIDTH + diff;
    if (activeSide === 'right') finalTranslate = -ACTION_WIDTH + diff;

    setTranslateX(finalTranslate);
    touchX.current = currentX;
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const diff = touchX.current - touchStart.current;
    
    if (diff > SWIPE_THRESHOLD && activeSide !== 'right') {
      setTranslateX(ACTION_WIDTH);
      setActiveSide('left');
    } else if (diff < -SWIPE_THRESHOLD && activeSide !== 'left') {
      setTranslateX(-ACTION_WIDTH);
      setActiveSide('right');
    } else {
      setTranslateX(0);
      setActiveSide('none');
    }
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setActiveSide('none');
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Actions (Mobile) */}
      <div className="absolute inset-0 flex sm:hidden">
        <button 
          onClick={() => { onEdit(); resetSwipe(); }}
          className={`absolute inset-y-0 left-0 w-[100px] bg-brand-500 text-white flex flex-col items-center justify-center gap-1 transition-opacity ${translateX > 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <Edit2 size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">Editar</span>
        </button>
        <button 
          onClick={() => { onDelete(); resetSwipe(); }}
          className={`absolute inset-y-0 right-0 w-[100px] bg-rose-500 text-white flex flex-col items-center justify-center gap-1 transition-opacity ${translateX < 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <Trash2 size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">Eliminar</span>
        </button>
      </div>

      {/* Main Content */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        className="relative z-10 bg-white h-full"
      >
        {children}
      </div>
    </div>
  );
};

// --- COMPONENTE SERVICIO (CARD) ---
interface ServiceCardProps {
  service: AnnualService;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete, onToggleStatus }) => {
  return (
    <SwipeableCard 
      onEdit={onEdit} 
      onDelete={onDelete}
      className={`rounded-[2rem] border transition-all duration-300 shadow-sm ${service.isPaid ? 'bg-stone-50 border-stone-100' : 'bg-white border-brand-200'}`}
    >
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 h-full">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <RenderServiceIcon type={service.iconType} isPaid={service.isPaid} />
            <h4 className={`font-bold text-lg ${service.isPaid ? 'text-stone-500' : 'text-stone-800'}`}>
              {service.concept}
            </h4>
          </div>
          <div className="mt-3 space-y-3 pl-1 sm:pl-0">
            {service.description && (
              <p className="text-xs font-medium text-stone-500 leading-relaxed max-w-xl">
                {service.description}
              </p>
            )}
            {(service.contractDate || service.dueDate) && (
              <div className="flex flex-wrap items-center gap-3">
                {service.contractDate && <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5"><CalendarIcon size={14} /> Contratado: {formatDate(service.contractDate)}</span>}
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
              onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${service.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
            >
              {service.isPaid ? 'Pagado' : 'Marcar Pagado'}
            </button>
            {/* Desktop Actions (Hidden on Mobile) */}
            <div className="hidden sm:flex gap-2">
              <button onClick={onEdit} className="p-2 text-stone-300 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"><Pencil size={18} /></button>
              <button onClick={onDelete} className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
};

// --- COMPONENTE CARGO (CARD) ---
interface ChargeCardProps {
  charge: ExtraCharge;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const ChargeCard: React.FC<ChargeCardProps> = ({ charge, onEdit, onDelete, onToggleStatus }) => {
  return (
    <SwipeableCard 
      onEdit={onEdit} 
      onDelete={onDelete}
      className={`rounded-[2rem] border transition-all duration-300 shadow-sm ${charge.status === 'paid' ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-200'}`}
    >
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 h-full">
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
              onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${charge.status === 'paid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
            >
              {charge.status === 'paid' ? 'Pagado' : 'Marcar Pagado'}
            </button>
            {/* Desktop Actions (Hidden on Mobile) */}
            <div className="hidden sm:flex gap-2">
              <button onClick={onEdit} className="p-2 text-stone-300 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"><Pencil size={18} /></button>
              <button onClick={onDelete} className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
};

// --- VIEW PRINCIPAL ---
export const BillingView = forwardRef<BillingViewRef, BillingViewProps>(
  ({ showToast, setConfirmDialog }, ref) => {
    
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
        id: 'srv-ssl', concept: 'Certificado de Seguridad SSL', description: 'Cifrado de datos y candado de seguridad obligatorio para pasarelas de pago y confianza del cliente.',
        amount: 350.00, isPaid: false, contractDate: '2025-09-17', dueDate: '2026-09-17', iconType: 'shield'
      },
      {
        id: 'srv-maintenance', concept: 'Administración y Mantenimiento', description: 'Respaldo de bases de datos, actualizaciones de seguridad, monitoreo 24/7 y soporte técnico general.',
        amount: 3500.00, isPaid: false, contractDate: '2025-09-17', dueDate: '2026-09-17', iconType: 'wrench'
      }
    ]);

    const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([
      {
        id: 'dev-1', concept: 'Saldo Pendiente: Desarrollo del Sistema', amount: 10000.00,
        status: 'pending', date: '2025-10-25'
      },
      {
        id: 'dev-google', concept: 'Cuenta de Desarrollador Google Play (Pago Único)', amount: 550.00, 
        status: 'pending', date: '2025-11-01'
      }
    ]);

    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [editingCharge, setEditingCharge] = useState<ExtraCharge | null>(null);
    const [chargeFormData, setChargeFormData] = useState({ concept: '', amount: '' });

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<AnnualService | null>(null);
    const [serviceFormData, setServiceFormData] = useState({ concept: '', description: '', amount: '', contractDate: '', dueDate: '' });

    useEffect(() => {
      if (isChargeModalOpen || isServiceModalOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }, [isChargeModalOpen, isServiceModalOpen]);

    useImperativeHandle(ref, () => ({
      handleSaveConfig: () => {
        showToast('Estado de cuenta y servicios actualizados correctamente', 'success');
      }
    }));

    // --- HANDLERS DE CARGOS ---
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
      setConfirmDialog({
        isOpen: true,
        title: '¿Eliminar Cargo?',
        message: 'Esta acción eliminará el cargo de la cuenta permanentemente.',
        confirmLabel: 'Sí, Eliminar',
        variant: 'danger',
        onConfirm: () => {
          setExtraCharges(prev => prev.filter(c => c.id !== id));
          showToast('Cargo eliminado');
          setConfirmDialog({ isOpen: false });
        }
      });
    };

    const toggleChargeStatus = (id: string) => {
      setExtraCharges(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'pending' ? 'paid' : 'pending' } : c));
    };

    // --- HANDLERS DE SERVICIOS ---
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
      setConfirmDialog({
        isOpen: true,
        title: '¿Eliminar Servicio?',
        message: 'El servicio será eliminado del plan anual. Esta acción no se puede deshacer.',
        confirmLabel: 'Sí, Eliminar',
        variant: 'danger',
        onConfirm: () => {
          setServices(prev => prev.filter(s => s.id !== id));
          showToast('Servicio eliminado');
          setConfirmDialog({ isOpen: false });
        }
      });
    };

    const toggleServiceStatus = (id: string) => {
      setServices(prev => prev.map(s => s.id === id ? { ...s, isPaid: !s.isPaid } : s));
    };

    // Cálculos
    const totalPendingFixed = services.filter(s => !s.isPaid).reduce((acc, curr) => acc + curr.amount, 0);
    const totalPendingExtra = extraCharges.filter(c => c.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const granTotalPending = totalPendingFixed + totalPendingExtra;

    const unpaidServices = services.filter(s => !s.isPaid && s.dueDate);
    const nextDueDate = unpaidServices.length > 0 
      ? unpaidServices.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0].dueDate 
      : null;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        
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
              <ServiceCard 
                key={service.id}
                service={service}
                onEdit={() => handleOpenServiceModal(service)}
                onDelete={() => removeService(service.id)}
                onToggleStatus={() => toggleServiceStatus(service.id)}
              />
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
                <ChargeCard 
                  key={charge.id}
                  charge={charge}
                  onEdit={() => handleOpenChargeModal(charge)}
                  onDelete={() => removeCharge(charge.id)}
                  onToggleStatus={() => toggleChargeStatus(charge.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Modals ... (Resto del código intacto) */}
        {/* Modal: Servicio Anual */}
        {isServiceModalOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsServiceModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                    {editingService ? 'Editar Servicio' : 'Nuevo Servicio Anual'}
                  </h3>
                  <button onClick={() => setIsServiceModalOpen(false)} className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors active:scale-90"><X size={20} strokeWidth={3} /></button>
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
            <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                    {editingCharge ? 'Editar Cargo' : 'Nuevo Cargo'}
                  </h3>
                  <button onClick={() => setIsChargeModalOpen(false)} className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors active:scale-90"><X size={20} strokeWidth={3} /></button>
                </div>
                <form onSubmit={handleSaveCharge} className="space-y-6">
                  {/* ... Inputs de Cargo ... */}
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