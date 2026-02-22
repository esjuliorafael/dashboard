
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, Trash2, Search, Tag, Plus, X, Check, CornerDownRight, Layers } from 'lucide-react';

interface SubcategoryItem {
  id: string;
  name: string;
  count: number;
}

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  subcategories: SubcategoryItem[];
}

interface CategoryListProps {
  searchQuery: string;
  onEdit: (category: {id: string, name: string}) => void;
  onDelete: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  setConfirmDialog: (dialog: any) => void;
}

const MOCK_DATA: CategoryItem[] = [
  { 
    id: '1', name: 'Paisajes', count: 42, 
    subcategories: [
      { id: '1-1', name: 'Atardeceres', count: 18 },
      { id: '1-2', name: 'Amaneceres', count: 12 },
      { id: '1-3', name: 'Drone', count: 12 }
    ] 
  },
  { 
    id: '2', name: 'Cultura', count: 128,
    subcategories: [
      { id: '2-1', name: 'Gastronomía', count: 45 },
      { id: '2-2', name: 'Mezcal', count: 83 }
    ]
  },
  { id: '3', name: 'Ganado', count: 85, subcategories: [] },
  { id: '4', name: 'Eventos', count: 31, subcategories: [] },
  { id: '5', name: 'Actividades', count: 56, subcategories: [] },
  { id: '6', name: 'Instalaciones', count: 19, subcategories: [] },
  { id: '7', name: 'Campo', count: 74, subcategories: [] },
  { id: '8', name: 'Tienda', count: 22, subcategories: [] },
];

export const CategoryList: React.FC<CategoryListProps> = ({ searchQuery, onEdit, onDelete, showToast, setConfirmDialog }) => {
  const [activeManagerCat, setActiveManagerCat] = useState<CategoryItem | null>(null);
  const [managerView, setManagerView] = useState<'list' | 'form'>('list');
  const [editingSub, setEditingSub] = useState<SubcategoryItem | null>(null);
  const [subNameInput, setSubNameInput] = useState('');

  const filtered = useMemo(() => {
    return MOCK_DATA.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery]);

  const openManager = (cat: CategoryItem, startWithForm = false) => {
    setActiveManagerCat(cat);
    if (startWithForm) {
      setManagerView('form');
      setEditingSub(null);
      setSubNameInput('');
    } else {
      setManagerView('list');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeManager = () => {
    setActiveManagerCat(null);
    setManagerView('list');
    setEditingSub(null);
    setSubNameInput('');
    document.body.style.overflow = 'unset';
  };

  const handleSubSubmit = () => {
    if (!subNameInput.trim()) return;
    if (editingSub) {
      console.log(`Edit sub ${editingSub.id} to ${subNameInput}`);
      showToast('Subcategoría actualizada');
    } else {
      console.log(`Create sub ${subNameInput} in ${activeManagerCat?.id}`);
      showToast('Subcategoría creada con éxito');
    }
    setManagerView('list');
    setEditingSub(null);
    setSubNameInput('');
  };

  const startEditSub = (sub: SubcategoryItem) => {
    setEditingSub(sub);
    setSubNameInput(sub.name);
    setManagerView('form');
  };

  const handleDeleteSub = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Eliminar subcategoría?',
      message: 'Esta acción desvinculará los medios asociados pero no los eliminará.',
      confirmLabel: 'Eliminar',
      variant: 'danger',
      onConfirm: () => {
        console.log('Delete sub:', id);
        showToast('Subcategoría eliminada');
        setConfirmDialog({ isOpen: false });
      }
    });
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Grid of Main Categories */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((cat, idx) => (
            <div 
              key={cat.id} 
              className="flex flex-col bg-white p-6 sm:p-7 rounded-[2.5rem] shadow-sm border border-white/60 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 animate-in fade-in zoom-in-95 group"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 bg-brand-50 text-brand-500 rounded-2xl group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Tag size={22} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => onEdit({id: cat.id, name: cat.name})}
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-xl transition-colors active:scale-90"
                    title="Editar Categoría"
                  >
                    <Edit2 size={16} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => onDelete(cat.id)}
                    className="p-2.5 bg-stone-50 hover:bg-rose-50 hover:text-rose-600 text-stone-600 rounded-xl transition-colors active:scale-90"
                    title="Eliminar Categoría"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-black text-stone-800 text-lg sm:text-xl tracking-tight truncate leading-tight">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 rounded-lg">
                    <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest leading-none">
                      {cat.count} medios
                    </span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-stone-200" />
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    {cat.subcategories.length} subgrupos
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button 
                  onClick={() => openManager(cat)}
                  className="px-4 py-3 bg-stone-50 hover:bg-stone-100 text-stone-600 text-[10px] font-black rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-stone-100"
                >
                  <Layers size={14} />
                  Ver Subs
                </button>
                <button 
                  onClick={() => openManager(cat, true)}
                  className="px-4 py-3 bg-brand-50 hover:bg-brand-100 text-brand-600 text-[10px] font-black rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-brand-100/30"
                >
                  <Plus size={14} strokeWidth={3} />
                  Nueva Sub
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-stone-200 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 mb-6 border border-stone-200 shadow-inner">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-800">No hay categorías</h3>
          <p className="text-stone-500 mt-2 max-w-xs text-center">No se encontraron categorías que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* Subcategory Manager */}
      {activeManagerCat && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={closeManager}
          />
          
          <div className="relative w-full max-w-2xl bg-white rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] sm:max-h-[80vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-500">
            
            <div className="px-8 pt-8 pb-6 border-b border-stone-100 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Subcategorías</span>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight leading-none">
                    {activeManagerCat.name}
                  </h3>
                </div>
                <button 
                  onClick={closeManager}
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors active:scale-90"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            </div>

            {managerView === 'list' && (
              <>
                <div className="flex-1 overflow-y-auto p-8 space-y-3 no-scrollbar">
                  {activeManagerCat.subcategories.length > 0 ? (
                    activeManagerCat.subcategories.map((sub, sidx) => (
                      <div 
                        key={sub.id} 
                        className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-brand-100 hover:bg-white transition-all duration-300 animate-in fade-in slide-in-from-left-4 shadow-sm hover:shadow-md"
                        style={{ animationDelay: `${sidx * 40}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-xl text-stone-300 border border-stone-100 shadow-sm">
                            <CornerDownRight size={14} strokeWidth={3} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-stone-800">{sub.name}</span>
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{sub.count} medios asociados</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => startEditSub(sub)}
                            className="p-2.5 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all active:scale-90"
                          >
                            <Edit2 size={16} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSub(sub.id)}
                            className="p-2.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200 mb-6 border border-stone-100/50">
                        <Layers size={32} />
                      </div>
                      <p className="text-stone-400 text-sm font-black uppercase tracking-widest">No hay subgrupos definidos</p>
                      <p className="text-stone-400 text-xs mt-1 max-w-[200px] leading-relaxed">Crea subcategorías para organizar con mayor detalle el contenido de {activeManagerCat.name}.</p>
                    </div>
                  )}
                </div>
                
                <div className="p-8 pt-0 shrink-0">
                  <button 
                    onClick={() => { setManagerView('form'); setEditingSub(null); setSubNameInput(''); }}
                    className="w-full py-4 bg-brand-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Plus size={20} strokeWidth={3} />
                    Nueva Subcategoría
                  </button>
                </div>
              </>
            )}

            {managerView === 'form' && (
              <div className="flex-1 overflow-y-auto p-8 animate-in fade-in slide-in-from-right-10 duration-500">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSubSubmit(); }}
                  className="space-y-6"
                >
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                      Nombre de la Subcategoría *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Atardeceres, Equipo A, Temporada 1..."
                      value={subNameInput}
                      autoFocus
                      onChange={(e) => setSubNameInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setManagerView('list')}
                      className="flex-1 py-4 bg-stone-50 text-stone-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all active:scale-[0.98] border border-stone-200/50"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={!subNameInput.trim()}
                      className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2
                        ${!subNameInput.trim() ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600'}
                      `}
                    >
                      <Check size={16} strokeWidth={3} />
                      {editingSub ? 'Guardar Cambios' : 'Crear Subcategoría'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      , document.body)}
    </div>
  );
};
