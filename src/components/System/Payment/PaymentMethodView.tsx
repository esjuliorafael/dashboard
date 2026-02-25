import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Building2, User, CreditCard, Hash, ChevronRight, Briefcase, Info } from 'lucide-react';

export interface PaymentMethodViewRef {
  handleSaveConfig: () => void;
  handleSaveChannels: () => void;
}

interface PaymentMethodViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
  subView: 'config' | 'channels';
  setSubView: (view: 'config' | 'channels') => void;
}

// Interfaz para la configuración bancaria compartida
interface BankDetails {
  bankName: string;
  beneficiary: string;
  clabe: string;
  cardNumber: string;
}

// Interfaz para cada canal de venta
interface SalesChannel extends BankDetails {
  id: string;
  name: string;
  purposeKey: string;
}

export const PaymentMethodView = forwardRef<PaymentMethodViewRef, PaymentMethodViewProps>(
  ({ showToast, subView, setSubView }, ref) => {
    
    // Estado para la cuenta por defecto (Carritos mixtos o sin propósito)
    const [defaultPayment, setDefaultPayment] = useState<BankDetails>({
      bankName: 'BBVA Bancomer',
      beneficiary: 'Rancho Las Trojes',
      clabe: '012345678901234567',
      cardNumber: '4152313456789012'
    });

    // Estado para las cuentas de canales específicos (Combate, Cría, etc.)
    const [channels, setChannels] = useState<SalesChannel[]>([
      {
        id: 'channel-1',
        name: 'Departamento de Combate',
        purposeKey: 'Combate',
        bankName: '',
        beneficiary: '',
        clabe: '',
        cardNumber: ''
      },
      {
        id: 'channel-2',
        name: 'Departamento de Cría (Veterinario)',
        purposeKey: 'Cría',
        bankName: 'Santander',
        beneficiary: 'Dr. Juan Pérez',
        clabe: '014123456789012345',
        cardNumber: ''
      }
    ]);

    useImperativeHandle(ref, () => ({
      handleSaveConfig: () => {
        if (!defaultPayment.bankName.trim() || !defaultPayment.beneficiary.trim()) {
          showToast('Por favor completa el banco y el beneficiario de la cuenta principal.', 'error');
          return;
        }
        showToast('Cuenta principal guardada correctamente', 'success');
      },
      handleSaveChannels: () => {
        showToast('Cuentas de canales de venta actualizadas', 'success');
        setSubView('config'); // Regresa a la vista principal tras guardar
      }
    }));

    const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDefaultPayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChannelChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
      setChannels(prev => prev.map(channel => 
        channel.id === id ? { ...channel, [e.target.name]: e.target.value } : channel
      ));
    };

    // VISTA DE CANALES DE VENTA (SUB-VISTA)
    if (subView === 'channels') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="bg-brand-50 border border-brand-100 p-6 rounded-[2rem] flex gap-4 items-start">
            <div className="text-brand-500 mt-1"><Info size={24} /></div>
            <div>
              <h4 className="font-bold text-brand-900">Cuentas Específicas</h4>
              <p className="text-sm text-brand-700 mt-1">
                Define la información bancaria específica para cada propósito. Si un cliente compra un producto de "Cría", verá la cuenta asignada aquí. Si el pedido es mixto, verá la cuenta principal.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {channels.map((channel) => (
              <div key={channel.id} className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm">{channel.name}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Propósito en sistema: {channel.purposeKey}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Banco</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><Building2 size={18} /></span>
                      <input type="text" name="bankName" value={channel.bankName} onChange={(e) => handleChannelChange(channel.id, e)} placeholder="Ej. BBVA, Santander..." className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Beneficiario</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><User size={18} /></span>
                      <input type="text" name="beneficiary" value={channel.beneficiary} onChange={(e) => handleChannelChange(channel.id, e)} placeholder="Nombre del titular" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">CLABE Interbancaria</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><Hash size={18} /></span>
                      <input type="text" name="clabe" value={channel.clabe} onChange={(e) => handleChannelChange(channel.id, e)} placeholder="18 dígitos" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">No. Tarjeta</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><CreditCard size={18} /></span>
                      <input type="text" name="cardNumber" value={channel.cardNumber} onChange={(e) => handleChannelChange(channel.id, e)} placeholder="16 dígitos" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // VISTA PRINCIPAL (CONFIGURACIÓN POR DEFECTO)
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        
        {/* Tarjeta Cuenta Principal (Ahora idéntica en diseño a los canales) */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm">Cuenta Bancaria Principal</h3>
              <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Recibe los pagos de órdenes mixtas o globales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Banco</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><Building2 size={18} /></span>
                <input type="text" name="bankName" value={defaultPayment.bankName} onChange={handleDefaultChange} placeholder="Ej. BBVA, Santander..." className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Nombre del Beneficiario</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><User size={18} /></span>
                <input type="text" name="beneficiary" value={defaultPayment.beneficiary} onChange={handleDefaultChange} placeholder="Titular de la cuenta" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">CLABE Interbancaria</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><Hash size={18} /></span>
                <input type="text" name="clabe" value={defaultPayment.clabe} onChange={handleDefaultChange} placeholder="18 dígitos" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">No. Tarjeta</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><CreditCard size={18} /></span>
                <input type="text" name="cardNumber" value={defaultPayment.cardNumber} onChange={handleDefaultChange} placeholder="16 dígitos" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
              </div>
            </div>
          </div>
          
        </div>

        {/* Resumen y Acceso a Canales de Venta */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs">Desglose por Departamento</h3>
          </div>

          <div className="bg-stone-900 p-8 rounded-[3rem] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="flex items-center gap-6 sm:gap-12">
              <div className="w-16 h-16 rounded-[1.5rem] bg-stone-800 flex items-center justify-center text-stone-400">
                <Briefcase size={32} />
              </div>
              <div className="text-left">
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Canales Configurables</p>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-5xl font-black tracking-tighter">{channels.length}</p>
                  <span className="text-stone-500 font-bold pb-1 text-sm">Departamentos</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSubView('channels')}
              className="w-full sm:w-auto px-10 py-5 bg-white text-stone-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg"
            >
              Configurar Canales
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    );
  }
);