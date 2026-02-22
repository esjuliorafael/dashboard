
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface CategoryFormProps {
  initialData?: { id: string; name: string };
  onCancel: () => void;
  onSave: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onCancel, onSave }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSave();
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/60 overflow-hidden">
        <div className="p-8 sm:p-10">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Required Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Nombre de la Categoría *
              </label>
              <input 
                type="text" 
                placeholder="Ej. Temporada de Cosecha, Nuevas Instalaciones..."
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              {!name.trim() && (
                <p className="text-[10px] text-stone-300 font-bold uppercase ml-1 tracking-tighter">Este campo es obligatorio para continuar</p>
              )}
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg
                  ${!name.trim() || isSubmitting 
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed' 
                    : 'bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/20'}
                `}
              >
                {isSubmitting ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
