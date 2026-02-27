import React from 'react';
import { 
  Image, PlusCircle, Layers, ShoppingBag, 
  PackagePlus, ListOrdered, ClipboardList, PenTool, 
  Settings, Truck, Users, LayoutGrid, Tags, FolderPlus,
  ArrowLeft, CreditCard, MessageCircle, Timer, Bell, Receipt // <-- Importamos Receipt
} from 'lucide-react';
import { QuickActionGroup } from '../types';

interface QuickActionsProps {
  className?: string;
  context?: string;
  onAction?: (label: string) => void;
  isDetail?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className, context, onAction, isDetail }) => {
  const allActions = [
    {
      group: 'Galería',
      items: [
        { icon: <Image size={20} />, label: 'Ver Medios' },
        { icon: <PlusCircle size={20} />, label: 'Nuevo Medio' },
        { icon: <Tags size={20} />, label: 'Ver Categorías' },
        { icon: <FolderPlus size={20} />, label: 'Nueva Categoría' },
      ]
    },
    {
      group: 'Tienda',
      items: [
        { icon: <ShoppingBag size={20} />, label: 'Ver Productos' },
        { icon: <PackagePlus size={20} />, label: 'Nuevo Producto' },
      ]
    },
    {
      group: 'Órdenes',
      items: [
        { 
          icon: isDetail ? <ArrowLeft size={20} /> : <ClipboardList size={20} />, 
          label: isDetail ? 'Volver' : 'Ver Órdenes' 
        },
      ]
    },
    {
      group: 'Sistema',
      items: [
        { icon: <PenTool size={20} />, label: 'Añadir Logo' },
        { icon: <CreditCard size={20} />, label: 'Método de Pago' },
        { icon: <MessageCircle size={20} />, label: 'WhatsApp' },
        { icon: <Truck size={20} />, label: 'Configurar Envíos' },
        { icon: <Timer size={20} />, label: 'Lib. Inventario' },
        { icon: <Bell size={20} />, label: 'Notificaciones' },
        { icon: <Receipt size={20} />, label: 'Estado de Cuenta' }, // <-- Nuevo botón añadido
        { icon: <Users size={20} />, label: 'Usuarios' },
        { icon: <Settings size={20} />, label: 'Config' },
      ]
    }
  ];

  // If we have a context (e.g. "Galería"), filter to show only that group
  const filteredActions = context && context !== 'Principal'
    ? allActions.filter(group => group.group === context)
    : allActions;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Mobile/Tablet: Horizontal Scroll */}
      <div className="lg:hidden w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          {filteredActions.flatMap((group, gIndex) => 
            group.items.map((action, iIndex) => (
              <button 
                key={`${gIndex}-${iIndex}`}
                onClick={() => onAction?.(action.label)}
                className="flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-sm border border-stone-100 min-w-[80px] h-[80px] active:scale-95 transition-transform"
              >
                <div className="text-stone-600 mb-1.5 bg-stone-50 p-2 rounded-full">
                  {action.icon}
                </div>
                <span className="text-[10px] font-medium text-stone-500 text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Desktop: Vertical Sticky Sidebar Style */}
      <div className="hidden lg:flex flex-col gap-6 sticky top-24">
        {filteredActions.map((group, idx) => (
          <div key={idx} className="group relative">
            <div className="flex flex-col gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white/50">
              {group.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx}
                  onClick={() => onAction?.(item.label)}
                  className="p-3 rounded-xl text-stone-500 hover:bg-brand-50 hover:text-brand-600 transition-all duration-200 relative group/btn flex items-center justify-center"
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className="absolute left-full ml-4 px-3 py-1.5 bg-stone-800 text-white text-xs rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};