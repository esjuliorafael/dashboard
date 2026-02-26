import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Timer, Info, RotateCcw } from 'lucide-react';

export interface InventorySettingsViewRef {
  handleSaveConfig: () => void;
}

interface InventorySettingsViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const InventorySettingsView = forwardRef<InventorySettingsViewRef, InventorySettingsViewProps>(
  ({ showToast }, ref) => {
    
    // Estado inicial de la configuración
    const [config, setConfig] = useState({
      active: true,
      hours: 24
    });

    useImperativeHandle(ref, () => ({
      handleSaveConfig: () => {
        if (config.active && (!config.hours || config.hours <= 0)) {
          showToast('Por favor ingresa un número de horas válido mayor a 0.', 'error');
          return;
        }
        showToast('Configuración de liberación guardada correctamente', 'success');
      }
    }));

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        
        {/* Banner de Información */}
        <div className="bg-brand-50 border border-brand-100 p-6 rounded-[2rem] flex gap-4 items-start shadow-sm">
          <div className="text-brand-500 mt-1"><Info size={24} /></div>
          <div>
            <h4 className="font-bold text-brand-900">¿Cómo funciona la liberación automática?</h4>
            <p className="text-sm text-brand-800 mt-1 leading-relaxed">
              Cuando esta opción está activa, el sistema revisará periódicamente las órdenes con estado <strong>"Pendiente"</strong>. Si una orden supera el tiempo límite establecido desde su creación, se marcará automáticamente como <strong>"Cancelada"</strong>. Las aves reservadas volverán a estar disponibles y el stock de los artículos será reabastecido.
            </p>
          </div>
        </div>

        {/* Tarjeta Principal */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          
          {/* Cabecera con Toggle clonado de Payment/WhatsApp */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm leading-tight">Liberación de Apartados</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Cancela órdenes vencidas y recupera stock</p>
              </div>
            </div>

            {/* Toggle Button */}
            <button 
              onClick={() => setConfig({ ...config, active: !config.active })}
              className={`flex-shrink-0 w-14 h-7 rounded-full transition-all relative ${config.active ? 'bg-brand-500' : 'bg-stone-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${config.active ? 'left-8' : 'left-1'}`} />
            </button>
          </div>

          {/* Formulario que reacciona a la activación */}
          <div className="grid grid-cols-1 gap-6 max-w-4xl transition-all duration-300" style={{ opacity: config.active ? 1 : 0.5, pointerEvents: config.active ? 'auto' : 'none' }}>
            
            {/* Input de Horas limitado en ancho para mantener proporción */}
            <div className="group max-w-md">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Tiempo Límite de Pago</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none">
                  <Timer size={18} />
                </span>
                <input 
                  type="number" 
                  min="1"
                  name="hours" 
                  value={config.hours} 
                  onChange={(e) => setConfig({ ...config, hours: parseInt(e.target.value) || 0 })} 
                  placeholder="Ej. 24" 
                  className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-16 outline-none transition-all font-black text-stone-700 shadow-sm" 
                />
                <span className="absolute right-5 inset-y-0 flex items-center justify-center text-stone-400 font-bold text-[10px] uppercase tracking-widest pointer-events-none">
                  Horas
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium mt-2 ml-2 leading-relaxed">
                Después de este periodo, el sistema cancelará la orden de forma automática si no ha sido pagada.
              </p>
            </div>

          </div>
        </div>

      </div>
    );
  }
);