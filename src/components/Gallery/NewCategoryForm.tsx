import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface NewCategoryFormProps {
  onSave: () => void;
  onCancel?: () => void; // Lo dejamos opcional por si GalleryView aún lo envía, pero ya no lo usamos aquí.
}

export const NewCategoryForm: React.FC<NewCategoryFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    // Simula la llamada a la API
    setTimeout(() => {
      onSave();
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/60 overflow-hidden">
        <div className="p-8 sm:p-10">
          
          {/* Añadimos el ID al form para enlazarlo con el botón píldora externo de App.tsx */}
          <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Nombre de la Categoría *
              </label>
              <input 
                type="text" 
                required
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

            <div className="bg-stone-50/80 p-6 rounded-[2rem] border border-stone-100 flex items-start gap-5">
              <div className="p-3 bg-white rounded-2xl text-stone-400 shadow-sm shrink-0">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="text-stone-800 font-black text-xs uppercase tracking-tight">Estructura y Organización</h5>
                <p className="text-stone-500 text-[13px] font-medium leading-relaxed max-w-4xl">
                  La categoría que crees aquí estará disponible inmediatamente al subir nuevos medios en la Galería. Organiza tu contenido de forma clara para facilitar la gestión y el filtrado del catálogo del rancho. Una estructura lógica permite a los usuarios encontrar el contenido visual más relevante con mayor rapidez.
                </p>
              </div>
            </div>

            {/* BOTÓN OCULTO: Solo sirve para activar el submit al presionar Enter. No es visible. */}
            <button type="submit" className="hidden" disabled={!name.trim() || isSubmitting} />
          </form>
          
        </div>
      </div>
    </div>
  );
};