// Ruta: src/components/System/Payment/PaymentMethodView.tsx
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Building2, User, CreditCard, Hash } from 'lucide-react';

export interface PaymentMethodViewRef {
  handleSave: () => void;
}

interface PaymentMethodViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const PaymentMethodView = forwardRef<PaymentMethodViewRef, PaymentMethodViewProps>(
  ({ showToast }, ref) => {
    // Estado inicial simulado actualizado con 4 campos
    const [formData, setFormData] = useState({
      bankName: 'BBVA Bancomer',
      beneficiary: 'Rancho Las Trojes',
      clabe: '012345678901234567',
      cardNumber: '4152313456789012'
    });

    useImperativeHandle(ref, () => ({
      handleSave: () => {
        // Validación: Requerir Banco y Beneficiario
        if (!formData.bankName.trim() || !formData.beneficiary.trim()) {
          showToast('Por favor completa el banco y el beneficiario.', 'error');
          return;
        }
        
        // Validación: Requerir al menos CLABE o Tarjeta
        if (!formData.clabe.trim() && !formData.cardNumber.trim()) {
          showToast('Por favor ingresa al menos la CLABE o el número de tarjeta.', 'error');
          return;
        }
        
        // Aquí iría la lógica de guardado en el backend
        showToast('Método de pago actualizado correctamente', 'success');
      }
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

    return (
      <div className="w-full bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-12 transition-all duration-300 min-h-[420px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4">
        
        {/* Cambiamos el ancho a max-w-4xl para acomodar mejor las dos columnas */}
        <div className="max-w-4xl mx-auto w-full">
          
          {/* Layout en cuadrícula: 1 columna en móviles, 2 columnas desde pantallas sm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Banco</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none">
                  <Building2 size={18} />
                </span>
                <input 
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Ej. BBVA, Santander, Banorte..."
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Nombre del Beneficiario</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none">
                  <User size={18} />
                </span>
                <input 
                  type="text"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={handleChange}
                  placeholder="Nombre del titular de la cuenta"
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">CLABE Interbancaria</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none">
                  <Hash size={18} />
                </span>
                <input 
                  type="text"
                  name="clabe"
                  value={formData.clabe}
                  onChange={handleChange}
                  placeholder="18 dígitos"
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">No. Tarjeta</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none">
                  <CreditCard size={18} />
                </span>
                <input 
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="16 dígitos"
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                />
              </div>
            </div>

          </div>
          
        </div>

      </div>
    );
  }
);