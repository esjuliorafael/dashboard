import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Settings, MapPin, ChevronRight, Save, Truck, Info, AlertCircle, CheckCircle2, Package, Bird } from 'lucide-react';
import { ShippingConfig, StateZone, ShippingZone } from '../../../types';
import { MEXICO_STATES } from '../../../constants';

interface ShippingViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
  subView: 'config' | 'zones';
  setSubView: (view: 'config' | 'zones') => void;
}

export const ShippingView = forwardRef<{ handleSaveConfig: () => void; handleSaveZones: () => void }, ShippingViewProps>(
  ({ showToast, subView, setSubView }, ref) => {
    
    const [config, setConfig] = useState<ShippingConfig>({
      baseCostArticles: 250,
      freeShippingArticles: false,
      costNormalZone: 850,
      costExtendedZone: 1250,
      freeShippingBirds: false,
    });

    const [states, setStates] = useState<StateZone[]>(
      MEXICO_STATES.map((name, index) => ({
        id: `state-${index}`,
        name,
        zone: index % 3 === 0 ? 'extendida' : 'normal',
      }))
    );

    const [localStates, setLocalStates] = useState<StateZone[]>(states);

    const handleSaveConfig = () => {
      showToast('Configuración de costos guardada correctamente');
    };

    const handleSaveZones = () => {
      setStates(localStates);
      showToast('Zonificación territorial actualizada');
      setSubView('config');
    };

    useImperativeHandle(ref, () => ({
      handleSaveConfig,
      handleSaveZones
    }));

    const updateAllZones = (zone: ShippingZone) => {
      setLocalStates(prev => prev.map(s => ({ ...s, zone })));
    };

    const toggleStateZone = (id: string) => {
      setLocalStates(prev => prev.map(s => 
        s.id === id ? { ...s, zone: s.zone === 'normal' ? 'extendida' : 'normal' } : s
      ));
    };

    const stats = {
      normal: localStates.filter(s => s.zone === 'normal').length,
      extended: localStates.filter(s => s.zone === 'extendida').length,
    };

    if (subView === 'zones') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-stone-800 p-6 rounded-[2.5rem] text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Zona Normal</p>
                  <p className="text-3xl font-black mt-1">{stats.normal}</p>
                </div>
                <div className="w-px h-10 bg-stone-700 hidden md:block" />
                <div>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Zona Extendida</p>
                  <p className="text-3xl font-black mt-1">{stats.extended}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => updateAllZones('normal')}
                  className="px-5 py-2.5 bg-stone-700 hover:bg-stone-600 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  Asignar todos como Normal
                </button>
                <button 
                  onClick={() => updateAllZones('extendida')}
                  className="px-5 py-2.5 bg-stone-700 hover:bg-stone-600 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  Asignar todos como Extendida
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {localStates.map((state) => (
              <div 
                key={state.id}
                className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between gap-4 ${
                  state.zone === 'normal' 
                    ? 'bg-white border-white/60 shadow-sm' 
                    : 'bg-amber-50/30 border-amber-100 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-stone-800">{state.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    state.zone === 'normal' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {state.zone}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs font-medium text-stone-500">Zona Extendida</span>
                  <button 
                    onClick={() => toggleStateZone(state.id)}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      state.zone === 'extendida' ? 'bg-brand-500' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      state.zone === 'extendida' ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bloque: Envío de Artículos */}
          <section className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-500">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs leading-tight">Envío de Artículos</h3>
                <p className="text-[10px] text-stone-400 font-bold mt-1">COSTO BASE FIJO</p>
              </div>
            </div>
            
            <div className="space-y-8 flex-1">
              <div className={`space-y-2 group transition-all duration-300 ${config.freeShippingArticles ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Costo base envío artículos</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-brand-500 transition-colors font-bold text-lg">
                    $
                  </div>
                  <input 
                    type="number"
                    value={config.baseCostArticles}
                    disabled={config.freeShippingArticles}
                    onChange={(e) => setConfig({ ...config, baseCostArticles: Number(e.target.value) })}
                    className="w-full bg-white border-2 border-transparent focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-10 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                  />
                </div>
                {config.freeShippingArticles && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl border border-brand-100 animate-in zoom-in duration-300">
                    <Info size={14} />
                    <span>EL COSTO BASE SE IGNORA (ENVÍO GRATIS ACTIVO)</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm">Activar envío gratis</h4>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">Aplica para todos los artículos</p>
                  </div>
                  <button 
                    onClick={() => setConfig({ ...config, freeShippingArticles: !config.freeShippingArticles })}
                    className={`flex-shrink-0 w-14 h-7 rounded-full transition-all relative ${
                      config.freeShippingArticles ? 'bg-brand-500' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                      config.freeShippingArticles ? 'left-8' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bloque: Envío de Aves */}
          <section className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-500">
                <Bird size={24} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs leading-tight">Envío de Aves</h3>
                <p className="text-[10px] text-stone-400 font-bold mt-1">CONFIGURADO POR ZONA</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${config.freeShippingBirds ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Costo zona normal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-brand-500 transition-colors font-bold text-lg">
                      $
                    </div>
                    <input 
                      type="number"
                      value={config.costNormalZone}
                      disabled={config.freeShippingBirds}
                      onChange={(e) => setConfig({ ...config, costNormalZone: Number(e.target.value) })}
                      className="w-full bg-white border-2 border-transparent focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-10 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Costo zona extendida</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-brand-500 transition-colors font-bold text-lg">
                      $
                    </div>
                    <input 
                      type="number"
                      value={config.costExtendedZone}
                      disabled={config.freeShippingBirds}
                      onChange={(e) => setConfig({ ...config, costExtendedZone: Number(e.target.value) })}
                      className="w-full bg-white border-2 border-transparent focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-10 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {config.freeShippingBirds && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl border border-brand-100 animate-in zoom-in duration-300">
                  <Info size={14} />
                  <span>LOS COSTOS POR ZONA SE IGNORAN (ENVÍO GRATIS ACTIVO)</span>
                </div>
              )}

              <div className="pt-6 border-t border-stone-200 mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm">Activar envío gratis</h4>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">Aplica para todas las aves</p>
                  </div>
                  <button 
                    onClick={() => setConfig({ ...config, freeShippingBirds: !config.freeShippingBirds })}
                    className={`flex-shrink-0 w-14 h-7 rounded-full transition-all relative ${
                      config.freeShippingBirds ? 'bg-brand-500' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                      config.freeShippingBirds ? 'left-8' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Resumen de Zonificación */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs">Resumen de Zonificación</h3>
          </div>

          <div className="bg-stone-900 p-8 rounded-[3rem] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="flex items-center gap-12">
              <div className="text-center sm:text-left">
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Zona Normal</p>
                <p className="text-5xl font-black mt-1 tracking-tighter">{stats.normal}</p>
              </div>
              <div className="w-px h-16 bg-stone-800 hidden sm:block" />
              <div className="text-center sm:text-left">
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Zona Extendida</p>
                <p className="text-5xl font-black mt-1 tracking-tighter">{stats.extended}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setSubView('zones')}
              className="w-full sm:w-auto px-10 py-5 bg-white text-stone-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg"
            >
              Configurar Zonas
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);