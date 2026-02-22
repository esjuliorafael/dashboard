import React, { useState, useRef, useEffect } from 'react';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, Check } from 'lucide-react';
import { Order } from '../../types';

interface OrderCardItemProps {
  order: Order;
  onViewDetail: (order: Order) => void;
  onMarkAsPaid: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  isSwiped: boolean;
  onSwipe: (orderId: string | null) => void;
}

export const OrderCardItem: React.FC<OrderCardItemProps> = ({ 
  order, 
  onViewDetail, 
  onMarkAsPaid, 
  onCancelOrder,
  isSwiped,
  onSwipe
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeSide, setActiveSide] = useState<'none' | 'left' | 'right'>('none');
  
  const touchStart = useRef(0);
  const touchX = useRef(0);
  const touchY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  
  const SWIPE_THRESHOLD = 80;
  const ACTION_WIDTH = 120;

  useEffect(() => {
    if (!isSwiped && activeSide !== 'none') {
      setTranslateX(0);
      setActiveSide('none');
    }
  }, [isSwiped]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid': 
        return { 
          color: 'text-green-700 bg-green-50 border-green-100', 
          icon: <CheckCircle2 size={14} />,
          label: 'Pagada'
        };
      case 'pending': 
        return { 
          color: 'text-amber-700 bg-amber-50 border-amber-100', 
          icon: <Clock size={14} />,
          label: 'Pendiente'
        };
      case 'cancelled': 
        return { 
          color: 'text-red-700 bg-red-50 border-red-100', 
          icon: <XCircle size={14} />,
          label: 'Cancelada'
        };
      default: 
        return { 
          color: 'text-gray-600 bg-gray-50', 
          icon: <Package size={14} />,
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchX.current = touchStart.current;
    touchY.current = e.touches[0].clientY;
    setIsSwiping(true);
    isHorizontalSwipe.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStart.current;
    const diffY = currentY - touchY.current;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        isHorizontalSwipe.current = true;
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
        isHorizontalSwipe.current = false;
        setIsSwiping(false);
        return;
      }
    }

    if (isHorizontalSwipe.current) {
      // Prevent default to avoid page scroll while swiping
      if (e.cancelable) e.preventDefault();
      
      let finalTranslate = diffX;
      if (activeSide === 'left') finalTranslate = ACTION_WIDTH + diffX;
      if (activeSide === 'right') finalTranslate = -ACTION_WIDTH + diffX;

      // Constraints based on status
      const canSwipeRight = order.status === 'pending'; // Marcar como pagada
      const canSwipeLeft = order.status === 'pending'; // Cancelar

      if (finalTranslate > 0 && !canSwipeRight) finalTranslate = 0;
      if (finalTranslate < 0 && !canSwipeLeft) finalTranslate = 0;

      setTranslateX(finalTranslate);
      touchX.current = currentX;
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || !isHorizontalSwipe.current) {
      setIsSwiping(false);
      return;
    }

    setIsSwiping(false);
    const diff = touchX.current - touchStart.current;
    
    if (diff > SWIPE_THRESHOLD && order.status === 'pending') {
      setTranslateX(ACTION_WIDTH);
      setActiveSide('left');
      onSwipe(order.id);
    } else if (diff < -SWIPE_THRESHOLD && order.status === 'pending') {
      setTranslateX(-ACTION_WIDTH);
      setActiveSide('right');
      onSwipe(order.id);
    } else {
      setTranslateX(0);
      setActiveSide('none');
      if (isSwiped) onSwipe(null);
    }
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setActiveSide('none');
    onSwipe(null);
  };

  return (
    <div className="relative bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Background Actions - Mobile Only */}
      <div className="absolute inset-0 flex md:hidden">
        {/* Mark as Paid Action (Left) */}
        {order.status === 'pending' && (
          <button 
            onClick={() => { onMarkAsPaid(order.id); resetSwipe(); }}
            className={`absolute inset-y-0 left-0 w-[120px] bg-green-500 text-white flex flex-col items-center justify-center gap-1 transition-opacity ${translateX > 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            <Check size={24} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Pagada</span>
          </button>
        )}

        {/* Cancel Action (Right) */}
        {order.status === 'pending' && (
          <button 
            onClick={() => { onCancelOrder(order.id); resetSwipe(); }}
            className={`absolute inset-y-0 right-0 w-[120px] bg-rose-500 text-white flex flex-col items-center justify-center gap-1 transition-opacity ${translateX < 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            <XCircle size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cancelar</span>
          </button>
        )}
      </div>

      {/* Main Content Layer */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        className="relative z-10 bg-white p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-stone-400 tracking-widest uppercase">{order.id}</span>
              <span className="text-xs font-medium text-stone-400">•</span>
              <span className="text-xs font-bold text-stone-500">{order.date}</span>
            </div>
            <h3 className="text-lg font-black text-stone-800 tracking-tight">{order.customer}</h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total</span>
            <p className="text-xl font-black text-stone-900">${order.total.toLocaleString()}</p>
          </div>
          
          <div className="flex gap-2">
            {/* Desktop Actions - Hidden on Mobile */}
            <div className="hidden md:flex gap-2">
              {order.status === 'pending' && (
                <>
                  <button 
                    onClick={() => onCancelOrder(order.id)}
                    className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => onMarkAsPaid(order.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    Pagada
                  </button>
                </>
              )}
            </div>
            
            {/* Details Button - Always Visible */}
            <button 
              onClick={() => onViewDetail(order)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Detalles
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
