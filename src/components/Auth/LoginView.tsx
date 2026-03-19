import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, User, ArrowRight, Loader2, X } from 'lucide-react';
import { apiAuth, apiSystem, ASSET_BASE_URL } from '../../api';
 
interface LoginViewProps {
  onLoginSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}
 
const ANIMATION_STYLES = `
  @keyframes ambient-in {
    0%   { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes logo-enter {
    0%   { opacity: 0; transform: scale(0.2) rotateZ(-12deg); filter: blur(24px); }
    55%  { opacity: 1; transform: scale(1.06) rotateZ(2deg);  filter: blur(0px);  }
    75%  { transform: scale(0.97) rotateZ(-1deg); }
    90%  { transform: scale(1.02) rotateZ(0.5deg); }
    100% { opacity: 1; transform: scale(1)    rotateZ(0deg);  filter: blur(0px);  }
  }
  @keyframes ring-pulse {
    0%, 100% { box-shadow: 0 0 0 0px rgba(180,126,116,0), 0 0 0 0px rgba(180,126,116,0); }
    50%       { box-shadow: 0 0 0 8px rgba(180,126,116,0.12), 0 0 0 16px rgba(180,126,116,0.06); }
  }
  @keyframes shimmer-sweep {
    0%   { transform: translateX(-180%) skewX(-12deg); }
    100% { transform: translateX(280%)  skewX(-12deg); }
  }
  @keyframes text-blur-up {
    0%   { opacity: 0; transform: translateY(28px); filter: blur(10px); }
    100% { opacity: 1; transform: translateY(0px);  filter: blur(0px);  }
  }
  @keyframes sub-fade {
    0%   { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0px);  }
  }
  @keyframes btn-bounce-in {
    0%   { opacity: 0; transform: translateY(36px) scale(0.92); }
    65%  { transform: translateY(-5px) scale(1.02); }
    82%  { transform: translateY(3px)  scale(0.99); }
    100% { opacity: 1; transform: translateY(0px)  scale(1);    }
  }
  @keyframes divider-grow {
    0%   { transform: scaleX(0); opacity: 0; }
    100% { transform: scaleX(1); opacity: 1; }
  }
  @keyframes modal-backdrop {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes sheet-up {
    0%   { opacity: 0; transform: translateY(100%); }
    100% { opacity: 1; transform: translateY(0%); }
  }
  @keyframes card-in {
    0%   { opacity: 0; transform: scale(0.92) translateY(20px); }
    100% { opacity: 1; transform: scale(1)    translateY(0px);  }
  }
  @keyframes input-line {
    0%   { width: 0%; opacity: 0; }
    100% { width: 100%; opacity: 1; }
  }
`;
 
export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<'logo' | 'text' | 'button'>('logo');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
 
  // Inject animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = ANIMATION_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
 
  // Orchestrate entrance phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'),   700);
    const t2 = setTimeout(() => setPhase('button'), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
 
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const config = await apiSystem.getConfig();
        if (config['sistema_logo']) {
          setLogoUrl(`${ASSET_BASE_URL}${config['sistema_logo']}?t=${Date.now()}`);
        }
      } catch (_) {}
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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, #1c0f0e 0%, #0c0807 60%, #070404 100%)' }}
    >
      {/* ── Layered ambient glows ── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 40% at 50% 100%, rgba(180,126,116,0.18) 0%, transparent 70%)',
          animation: 'ambient-in 2.2s cubic-bezier(0.16,1,0.3,1) both',
          animationDelay: '0.1s',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 30% 25% at 50% 102%, rgba(180,126,116,0.28) 0%, transparent 70%)',
          animation: 'ambient-in 2.8s cubic-bezier(0.16,1,0.3,1) both',
          animationDelay: '0.3s',
        }}
      />
 
      {/* ── Subtle grain texture ── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '180px',
        }}
      />
 
      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xs">
 
        {/* ─── LOGO ─── */}
        <div style={{ animation: 'logo-enter 1.1s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay: '0.05s' }}>
          {/* Outer decorative ring */}
          <div
            style={{
              width: 168, height: 168,
              borderRadius: '2.6rem',
              padding: 3,
              background: 'linear-gradient(135deg, rgba(180,126,116,0.55) 0%, rgba(180,126,116,0.05) 50%, rgba(180,126,116,0.35) 100%)',
              animation: 'ring-pulse 3.5s ease-in-out infinite',
              animationDelay: '1.5s',
            }}
          >
            {/* Card */}
            <div
              style={{
                width: '100%', height: '100%',
                borderRadius: 'calc(2.6rem - 3px)',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #1e1210 0%, #120b09 100%)',
                position: 'relative',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Shimmer sweep — runs once after entry */}
              <div
                style={{
                  position: 'absolute', top: 0, bottom: 0, width: '50%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                  animation: 'shimmer-sweep 1.1s ease-in-out both',
                  animationDelay: '0.9s',
                  zIndex: 2,
                }}
              />
              <img
                src={logoUrl || 'https://rancholastrojes.com.mx/assets/uploads/logo/logo_698abd3f7c34d.png'}
                alt="Rancho Las Trojes"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
              />
            </div>
          </div>
        </div>
 
        {/* ─── DIVIDER ─── */}
        <div
          style={{
            height: 1, width: 48, marginTop: 32, marginBottom: 28,
            background: 'linear-gradient(90deg, transparent, rgba(180,126,116,0.5), transparent)',
            transformOrigin: 'center',
            animation: phase !== 'logo' ? 'divider-grow 0.6s cubic-bezier(0.16,1,0.3,1) both' : 'none',
            opacity: phase !== 'logo' ? 1 : 0,
          }}
        />
 
        {/* ─── TITLE ─── */}
        <div style={{ opacity: phase !== 'logo' ? 1 : 0 }}>
          <h1
            style={{
              fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em',
              lineHeight: 1.1, marginBottom: '0.5rem',
              background: 'linear-gradient(160deg, #f5f0ef 20%, #c59d95 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: phase !== 'logo' ? 'text-blur-up 0.7s cubic-bezier(0.16,1,0.3,1) both' : 'none',
            }}
          >
            Rancho Las Trojes
          </h1>
 
          <p
            style={{
              color: 'rgba(180,126,116,0.55)',
              fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              animation: phase !== 'logo' ? 'sub-fade 0.7s cubic-bezier(0.16,1,0.3,1) both' : 'none',
              animationDelay: '0.1s',
            }}
          >
            Panel Administrativo
          </p>
 
          <p
            style={{
              color: 'rgba(255,255,255,0.28)',
              fontSize: '0.8rem', fontWeight: 400,
              lineHeight: 1.6, marginTop: '1rem',
              maxWidth: 240, margin: '1rem auto 0',
              animation: phase !== 'logo' ? 'sub-fade 0.7s cubic-bezier(0.16,1,0.3,1) both' : 'none',
              animationDelay: '0.2s',
            }}
          >
            Gestión integral de inventario, ventas y medios del rancho.
          </p>
        </div>
 
        {/* ─── BUTTON ─── */}
        <div
          style={{
            width: '100%', marginTop: '2rem',
            opacity: phase === 'button' ? 1 : 0,
            animation: phase === 'button' ? 'btn-bounce-in 0.75s cubic-bezier(0.34,1.2,0.64,1) both' : 'none',
          }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              width: '100%',
              padding: '1.1rem 2rem',
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, #b47e74 0%, #9d635a 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 32px rgba(180,126,116,0.35), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 40px rgba(180,126,116,0.45), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(180,126,116,0.35), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px) scale(0.99)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'}
          >
            <Lock size={15} strokeWidth={2.5} />
            Iniciar Sesión
          </button>
        </div>
      </div>
 
      {/* ─── MODAL / BOTTOM SHEET ─── */}
      {isModalOpen && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          className="sm:items-center sm:p-6"
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(7,4,4,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              animation: 'modal-backdrop 0.35s ease both',
            }}
            onClick={() => !isLoading && setIsModalOpen(false)}
          />
 
          {/* Sheet */}
          <div
            style={{
              position: 'relative', width: '100%', maxWidth: 440,
              background: 'linear-gradient(165deg, #1a0f0e 0%, #110b0a 100%)',
              borderTop: '1px solid rgba(180,126,116,0.2)',
              borderLeft: '1px solid rgba(180,126,116,0.08)',
              borderRight: '1px solid rgba(180,126,116,0.08)',
              borderRadius: '2.5rem 2.5rem 0 0',
              overflow: 'hidden',
              boxShadow: '0 -24px 80px rgba(0,0,0,0.8), 0 -4px 20px rgba(180,126,116,0.08)',
              animation: 'sheet-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
            }}
            className="sm:rounded-[2.5rem] sm:border-[1px] sm:border-[rgba(180,126,116,0.18)]"
          >
            {/* Top accent line */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(180,126,116,0.6), transparent)',
              }}
            />
 
            {/* Drag pill — mobile only */}
            <div className="sm:hidden flex justify-center pt-4 pb-0">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
            </div>
 
            <div style={{ padding: '2rem 2rem 2.5rem' }} className="sm:p-10">
 
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <p style={{ color: 'rgba(180,126,116,0.6)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Acceso seguro
                  </p>
                  <h3 style={{ color: '#f0ebe9', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                    Bienvenido de vuelta
                  </h3>
                </div>
                <button
                  onClick={() => !isLoading && setIsModalOpen(false)}
                  disabled={isLoading}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
 
              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
 
                {/* Username field */}
                <InputField
                  type="text"
                  placeholder="Usuario o correo electrónico"
                  value={formData.username}
                  onChange={v => setFormData(p => ({ ...p, username: v }))}
                  icon={<User size={16} strokeWidth={2} />}
                  isFocused={focusedField === 'username'}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  label="Usuario"
                />
 
                <InputField
                  type="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={v => setFormData(p => ({ ...p, password: v }))}
                  icon={<Lock size={16} strokeWidth={2} />}
                  isFocused={focusedField === 'password'}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  label="Contraseña"
                />
 
                {/* Submit */}
                <button
                  type="submit"
                  disabled={!formData.username || !formData.password || isLoading}
                  style={{
                    marginTop: '0.75rem',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '1.25rem',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: !formData.username || !formData.password || isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.25s ease',
                    ...(!formData.username || !formData.password || isLoading
                      ? {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.2)',
                        }
                      : {
                          background: 'linear-gradient(135deg, #b47e74 0%, #9d635a 100%)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 6px 24px rgba(180,126,116,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                          color: '#fff',
                        }
                    ),
                  }}
                >
                  {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Verificando...</>
                  ) : (
                    <>Entrar al Sistema <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
 
/* ── Reusable styled input ── */
interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  label: string;
}
 
const InputField: React.FC<InputFieldProps> = ({
  type, placeholder, value, onChange, icon,
  isFocused, onFocus, onBlur, disabled, label,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
    <label style={{
      fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: isFocused ? 'rgba(180,126,116,0.8)' : 'rgba(255,255,255,0.3)',
      marginLeft: '0.25rem',
      transition: 'color 0.2s ease',
    }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
        color: isFocused ? 'rgba(180,126,116,0.9)' : 'rgba(255,255,255,0.2)',
        transition: 'color 0.2s ease',
        pointerEvents: 'none',
        display: 'flex', alignItems: 'center',
      }}>
        {icon}
      </div>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.9rem 1rem 0.9rem 2.8rem',
          borderRadius: '1rem',
          background: isFocused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: isFocused
            ? '1px solid rgba(180,126,116,0.45)'
            : '1px solid rgba(255,255,255,0.07)',
          color: '#f0ebe9',
          fontSize: '0.88rem',
          fontWeight: 500,
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: isFocused ? '0 0 0 3px rgba(180,126,116,0.08), inset 0 1px 3px rgba(0,0,0,0.2)' : 'inset 0 1px 3px rgba(0,0,0,0.15)',
          boxSizing: 'border-box',
        }}
      />
    </div>
  </div>
);