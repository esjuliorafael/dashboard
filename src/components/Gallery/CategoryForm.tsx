import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface CategoryFormProps {
  initialData?: { id: string; name: string };
  onCancel: () => void;
  onSave: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onCancel, onSave, onValidationChange }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  // Avisamos a App.tsx cada vez que cambia el texto para activar/desactivar la píldora
  useEffect(() => {
    onValidationChange?.(name.trim().length > 0);
  }, [name, onValidationChange]);

  // Limpiamos la píldora si se desmonta el componente
  useEffect(() => {
    return () => onValidationChange?.(false);
  }, [onValidationChange]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onSave();
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/60 overflow-hidden">
        <div className="p-8 sm:p-10">
          
          <form id="category-form" onSubmit={handleSubmit} className="space-y-8">
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

            {/* Mostramos el bloque informativo solo cuando estamos creando una categoría nueva */}
            {!initialData && (
              <div className="bg-stone-50/80 p-6 rounded-[2rem] border border-stone-100 flex items-start gap-5">
                <div className="p-3 bg-white rounded-2xl text-stone-400 shadow-sm shrink-0">
                  <Info size={20} />
                </div>
                <div className="space-y-1">
                  <h5 className="text-stone-800 font-black text-xs uppercase tracking-tight">Estructura y Organización</h5>
                  <p className="text-stone-500 text-[13px] font-medium leading-relaxed max-w-4xl">
                    La categoría que crees aquí estará disponible inmediatamente al subir nuevos medios en la Galería. Organiza tu contenido de forma clara para facilitar la gestión y el filtrado del catálogo del rancho.
                  </p>
                </div>
              </div>
            )}

            {/* BOTÓN OCULTO: Permite enviar el formulario desde App.tsx o presionando la tecla "Enter" */}
            <button type="submit" className="hidden" disabled={!name.trim() || isSubmitting} />

          </form>
        </div>
      </div>
    </div>
  );
};