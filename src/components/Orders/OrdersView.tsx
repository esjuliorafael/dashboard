import React from 'react';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Order } from '../../types';

import { OrderCardItem } from './OrderCardItem';

interface OrdersViewProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onMarkAsPaid: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ 
  orders, 
  onViewDetail, 
  onMarkAsPaid, 
  onCancelOrder 
}) => {
  const [activeSwipeId, setActiveSwipeId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {orders.map((order) => {
        return (
          <OrderCardItem 
            key={order.id}
            order={order}
            onViewDetail={onViewDetail}
            onMarkAsPaid={onMarkAsPaid}
            onCancelOrder={onCancelOrder}
            isSwiped={activeSwipeId === order.id}
            onSwipe={(id) => setActiveSwipeId(id)}
          />
        );
      })}

      {orders.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
            <Package size={40} />
          </div>
          <h3 className="text-xl font-black text-stone-800">No hay órdenes</h3>
          <p className="text-stone-500">No se encontraron órdenes que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};
