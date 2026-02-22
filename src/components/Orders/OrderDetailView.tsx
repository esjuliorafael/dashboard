import React from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, Phone, MapPin, User, Calendar, DollarSign, Plane, Truck } from 'lucide-react';
import { Order } from '../../types';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onMarkAsPaid: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ 
  order, 
  onBack,
  onMarkAsPaid,
  onCancelOrder
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid': 
        return { 
          color: 'text-green-700 bg-green-50 border-green-100', 
          icon: <CheckCircle2 size={16} />,
          label: 'Pagada'
        };
      case 'pending': 
        return { 
          color: 'text-amber-700 bg-amber-50 border-amber-100', 
          icon: <Clock size={16} />,
          label: 'Pendiente'
        };
      case 'cancelled': 
        return { 
          color: 'text-red-700 bg-red-50 border-red-100', 
          icon: <XCircle size={16} />,
          label: 'Cancelada'
        };
      default: 
        return { 
          color: 'text-gray-600 bg-gray-50', 
          icon: <Package size={16} />,
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  const hasBirds = order.items.some(item => item.type === 'ave');
  const hasArticles = order.items.some(item => item.type === 'articulo');

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-end mb-8">
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Summary & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Info Card */}
          <div className="bg-white rounded-[3rem] p-8 border border-stone-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black text-stone-400 tracking-widest uppercase mb-1 block">Detalle de Orden</span>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight">{order.id}</h2>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Fecha</span>
                </div>
                <p className="font-bold text-stone-800">{order.date}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <DollarSign size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Total</span>
                </div>
                <p className="font-bold text-stone-800">${order.total.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <Package size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Productos</span>
                </div>
                <p className="font-bold text-stone-800">{order.items.length}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm">
            <div className="p-8 border-bottom border-stone-50">
              <h3 className="text-xl font-black text-stone-800 tracking-tight">Productos en la Orden</h3>
            </div>
            <div className="divide-y divide-stone-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'ave' ? 'bg-brand-50 text-brand-600' : 'bg-stone-100 text-stone-500'}`}>
                      {item.type === 'ave' ? <Plane size={24} /> : <Package size={24} />}
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">{item.name}</p>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">{item.type === 'ave' ? 'Ave' : 'Artículo'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-stone-900">${item.price.toLocaleString()}</p>
                    <p className="text-xs font-bold text-stone-400">Cant: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-stone-50 flex justify-between items-center">
              <span className="text-sm font-black text-stone-500 uppercase tracking-widest">Total de la Orden</span>
              <span className="text-2xl font-black text-stone-900">${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-8">
          {/* Customer Info Card */}
          <div className="bg-white rounded-[3rem] p-8 border border-stone-100 shadow-sm">
            <h3 className="text-xl font-black text-stone-800 tracking-tight mb-6">Información del Cliente</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Nombre</p>
                  <p className="font-bold text-stone-800">{order.customer}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Teléfono</p>
                  <p className="font-bold text-stone-800">{order.customerPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Estado</p>
                  <p className="font-bold text-stone-800">{order.customerState}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Logic Card */}
          <div className="bg-stone-900 rounded-[3rem] p-8 text-white shadow-xl shadow-stone-900/20">
            <h3 className="text-xl font-black tracking-tight mb-6">Información de Envío</h3>
            
            <div className="space-y-8">
              {hasBirds && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-brand-400">
                    <Plane size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Envío de Aves</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-sm font-medium leading-relaxed text-stone-300">
                      El envío se realiza al aeropuerto o terminal más cercana al estado de <span className="text-white font-bold">{order.customerState}</span>.
                    </p>
                  </div>
                </div>
              )}

              {hasArticles && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Truck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Envío de Artículos</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1">Dirección Completa</p>
                    <p className="text-sm font-medium leading-relaxed text-stone-300">
                      {order.customerAddress || 'No se proporcionó dirección completa.'}
                    </p>
                  </div>
                </div>
              )}

              {!hasBirds && !hasArticles && (
                <p className="text-stone-400 text-sm italic">No hay información de envío disponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
