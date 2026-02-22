import React from 'react';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Order } from '../../types';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid': 
        return { 
          color: 'text-green-700 bg-green-50 border-green-100', 
          icon: <CheckCircle2 size={12} />,
          label: 'Pagado'
        };
      case 'pending': 
        return { 
          color: 'text-amber-700 bg-amber-50 border-amber-100', 
          icon: <Clock size={12} />,
          label: 'Pendiente'
        };
      case 'cancelled': 
        return { 
          color: 'text-red-700 bg-red-50 border-red-100', 
          icon: <XCircle size={12} />,
          label: 'Cancelado'
        };
      default: 
        return { 
          color: 'text-gray-600 bg-gray-50', 
          icon: <Package size={12} />,
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* Left: Icon & Customer Info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors shrink-0">
          <Package size={20} />
        </div>
        <div className="flex flex-col">
          <h4 className="font-semibold text-stone-800 text-sm leading-tight">{order.customer}</h4>
          <span className="text-xs text-stone-500 mt-0.5 line-clamp-1">
            {order.items.length > 0 
              ? `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} más` : ''}`
              : 'Sin productos'}
          </span>
        </div>
      </div>
      
      {/* Right: Total & Status Stack */}
      <div className="flex flex-col items-end gap-1">
        <span className="font-bold text-stone-800 text-sm">${order.total.toLocaleString()}</span>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusConfig.color}`}>
          {statusConfig.icon}
          <span className="capitalize">{statusConfig.label}</span>
        </div>
      </div>
    </div>
  );
};