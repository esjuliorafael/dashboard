import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, User, ArrowRight, Loader2, X, ShieldCheck } from 'lucide-react';
import { apiAuth, apiSystem, ASSET_BASE_URL } from '../../api';

interface LoginViewProps {
  onLoginSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({ username: '', password: '' });

  // Cargar logo dinámico para la pantalla de inicio
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const config = await apiSystem.getConfig();
        if (config['sistema_logo']) {
          setLogoUrl(`${ASSET_BASE_URL}${config['sistema_logo']}?t=${new Date().getTime()}`);
        }
      } catch (e) {
        // Fallback silencioso en caso de error de red inicial
      }
    };
    loadLogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      showToast('Por favor, completa todos los campos.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await apiAuth.login(formData);
      showToast('Autenticación exitosa', 'success');
      onLoginSuccess();
    } catch (error: any) {
      showToast(error.message || 'No se pudo conectar con el servidor.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Fondo elegante con un sutil resplandor de la marca */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-brand-500/20 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">
        
        {/* 1. Logo Animado */}
        <div 
          className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
          style={{ animationFillMode: 'both' }}
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-[2.5rem] sm:rounded-[3rem] p-2 shadow-2xl shadow-black/50 mb-8 border-4 border-stone-800">
            <div className="w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex items-center justify-center bg-stone-50">
              <img
                src={logoUrl || "https://rancholastrojes.com.mx/assets/uploads/logo/logo_698abd3f7c34d.png"}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 2. Textos Animados (Cascada) */}
        <div 
          className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
          style={{ animationFillMode: 'both', animationDelay: '200ms' }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Rancho Las Trojes
          </h1>
          <p className="text-stone-400 font-medium text-sm sm:text-base px-2 leading-relaxed mb-12">
            Panel de administración corporativo. Gestión integral de inventario, ventas, medios y ajustes del sistema.
          </p>
        </div>

        {/* 3. Botón de Acción Principal */}
        <div 
          className="animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full"
          style={{ animationFillMode: 'both', animationDelay: '400ms' }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-brand-500 hover:bg-brand-400 text-white font-black text-sm uppercase tracking-widest py-5 rounded-[2rem] shadow-lg shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 border border-brand-400/50"
          >
            <ShieldCheck size={20} />
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Modal / Bottom Sheet */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => !isLoading && setIsModalOpen(false)} />

          {/* Comportamiento: Bottom Sheet en Móvil (rounded-t), Tarjeta centrada en Desktop (rounded) */}
          <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:zoom-in-95 duration-500">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">Acceso Seguro</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-1">Ingresa tus credenciales</p>
                </div>
                <button
                  onClick={() => !isLoading && setIsModalOpen(false)}
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors active:scale-90"
                  disabled={isLoading}
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="group space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Usuario o Correo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-brand-500 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="tu_usuario"
                        disabled={isLoading}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Contraseña</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-brand-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.username || !formData.password || isLoading}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 mt-8
                    ${(!formData.username || !formData.password || isLoading)
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 text-white shadow-xl hover:bg-stone-800 active:scale-95'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Verificando...
                    </>
                  ) : (
                    <>
                      Entrar al Sistema <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
};