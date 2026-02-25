import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { MessageCircle, FileText, ChevronRight, Briefcase, Info, Smartphone } from 'lucide-react';

export interface WhatsAppViewRef {
  handleSaveConfig: () => void;
  handleSaveChannels: () => void;
}

interface WhatsAppViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
  subView: 'config' | 'channels';
  setSubView: (view: 'config' | 'channels') => void;
}

interface WhatsAppDetails {
  active: boolean;
  phoneNumber: string;
  template: string;
}

interface WhatsAppChannel extends WhatsAppDetails {
  id: string;
  name: string;
  purposeKey: string;
}

export const WhatsAppView = forwardRef<WhatsAppViewRef, WhatsAppViewProps>(
  ({ showToast, subView, setSubView }, ref) => {
    
    // Configuración de WhatsApp por defecto
    const [defaultWhatsApp, setDefaultWhatsApp] = useState<WhatsAppDetails>({
      active: true,
      phoneNumber: '524432020019',
      template: 'Hola, he realizado el pedido #{id_orden}.\n\nCliente: {nombre_cliente}\nTotal: ${total}\n\nItems: {lista_productos}\n\nEl envío se realiza al aeropuerto o terminal más cercano a tu estado. Nos pondremos en contacto para coordinar la entrega.'
    });

    // Configuración por canales
    const [channels, setChannels] = useState<WhatsAppChannel[]>([
      {
        id: 'channel-1',
        name: 'Departamento de Combate',
        purposeKey: 'Combate',
        active: true,
        phoneNumber: '',
        template: 'Hola, he realizado un pedido de combate #{id_orden}.\n\nCliente: {nombre_cliente}\nTotal: ${total}\n\nItems: {lista_productos}'
      },
      {
        id: 'channel-2',
        name: 'Departamento de Cría (Veterinario)',
        purposeKey: 'Cría',
        active: true,
        phoneNumber: '525512345678',
        template: 'Hola Dr., he realizado un pedido de pie de cría #{id_orden}.\n\nCliente: {nombre_cliente}\nTotal: ${total}\n\nPor favor, indíqueme los cuidados previos al envío.'
      }
    ]);

    useImperativeHandle(ref, () => ({
      handleSaveConfig: () => {
        if (!defaultWhatsApp.phoneNumber.trim()) {
          showToast('Por favor ingresa un número de teléfono válido.', 'error');
          return;
        }
        showToast('Configuración principal de WhatsApp guardada', 'success');
      },
      handleSaveChannels: () => {
        showToast('Canales de WhatsApp actualizados correctamente', 'success');
        setSubView('config');
      }
    }));

    const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setDefaultWhatsApp(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleChannelChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setChannels(prev => prev.map(channel => 
        channel.id === id ? { ...channel, [e.target.name]: value } : channel
      ));
    };

    // VISTA DE CANALES DE VENTA (SUB-VISTA)
    if (subView === 'channels') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="bg-brand-50 border border-brand-100 p-6 rounded-[2rem] flex gap-4 items-start">
            <div className="text-brand-500 mt-1"><Info size={24} /></div>
            <div>
              <h4 className="font-bold text-brand-900">Mensajería por Departamento</h4>
              <p className="text-sm text-brand-700 mt-1">
                Personaliza a qué número llega el mensaje y qué texto predeterminado se envía según el tipo de ave comprada.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {channels.map((channel) => (
              <div key={channel.id} className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm">{channel.name}</h3>
                      <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Propósito: {channel.purposeKey}</p>
                    </div>
                  </div>
                  {/* Toggle Activo/Inactivo */}
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" name="active" checked={channel.active} onChange={(e) => handleChannelChange(channel.id, e)} className="sr-only" />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${channel.active ? 'bg-brand-500' : 'bg-stone-200'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${channel.active ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-xs font-bold uppercase tracking-widest text-stone-500">
                      {channel.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-4xl opacity-100 transition-opacity" style={{ opacity: channel.active ? 1 : 0.5, pointerEvents: channel.active ? 'auto' : 'none' }}>
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Número de WhatsApp</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><Smartphone size={18} /></span>
                      <input type="text" name="phoneNumber" value={channel.phoneNumber} onChange={(e) => handleChannelChange(channel.id, e)} placeholder="Ej. 524432020019 (Código de país + número sin espacios)" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium mt-2 ml-2">Debe incluir código de país (Ej. 52 para México). No incluyas el símbolo "+".</p>
                  </div>
                  
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Plantilla del Mensaje</label>
                    <div className="relative">
                      <span className="absolute left-5 top-5 flex items-start justify-center text-stone-400 pointer-events-none"><FileText size={18} /></span>
                      <textarea name="template" value={channel.template} onChange={(e) => handleChannelChange(channel.id, e)} rows={5} placeholder="Escribe la plantilla del mensaje..." className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm resize-none leading-relaxed"></textarea>
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium mt-2 ml-2">Variables permitidas: <span className="font-bold text-brand-600">{`{id_orden}`}</span>, <span className="font-bold text-brand-600">{`{nombre_cliente}`}</span>, <span className="font-bold text-brand-600">{`{total}`}</span>, <span className="font-bold text-brand-600">{`{lista_productos}`}</span></p>
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
        
        {/* Tarjeta WhatsApp Principal */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 uppercase tracking-widest text-sm">WhatsApp Principal</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Recibe los mensajes de órdenes mixtas o globales</p>
              </div>
            </div>
            {/* Toggle Activo/Inactivo */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="active" checked={defaultWhatsApp.active} onChange={handleDefaultChange} className="sr-only" />
                <div className={`block w-14 h-8 rounded-full transition-colors ${defaultWhatsApp.active ? 'bg-green-500' : 'bg-stone-200'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${defaultWhatsApp.active ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 text-xs font-bold uppercase tracking-widest text-stone-500">
                {defaultWhatsApp.active ? 'Activo' : 'Inactivo'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-4xl opacity-100 transition-opacity" style={{ opacity: defaultWhatsApp.active ? 1 : 0.5, pointerEvents: defaultWhatsApp.active ? 'auto' : 'none' }}>
            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Número de WhatsApp Principal</label>
              <div className="relative">
                <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none"><Smartphone size={18} /></span>
                <input type="text" name="phoneNumber" value={defaultWhatsApp.phoneNumber} onChange={handleDefaultChange} placeholder="Ej. 524432020019" className="w-full bg-stone-50 border-2 border-transparent focus:border-green-500/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Plantilla del Mensaje</label>
              <div className="relative">
                <span className="absolute left-5 top-5 flex items-start justify-center text-stone-400 pointer-events-none"><FileText size={18} /></span>
                <textarea name="template" value={defaultWhatsApp.template} onChange={handleDefaultChange} rows={6} placeholder="Escribe la plantilla del mensaje..." className="w-full bg-stone-50 border-2 border-transparent focus:border-green-500/20 focus:bg-white focus:ring-4 focus:ring-green-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm resize-none leading-relaxed"></textarea>
              </div>
              <p className="text-[10px] text-stone-400 font-medium mt-2 ml-2">Variables: <span className="font-bold text-green-600">{`{id_orden}`}</span>, <span className="font-bold text-green-600">{`{nombre_cliente}`}</span>, <span className="font-bold text-green-600">{`{total}`}</span>, <span className="font-bold text-green-600">{`{lista_productos}`}</span></p>
            </div>
          </div>
          
        </div>

        {/* Resumen y Acceso a Canales */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs">Desglose por Departamento</h3>
          </div>

          <div className="bg-stone-900 p-8 rounded-[3rem] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="flex items-center gap-6 sm:gap-12">
              <div className="w-16 h-16 rounded-[1.5rem] bg-stone-800 flex items-center justify-center text-stone-400">
                <MessageCircle size={32} />
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