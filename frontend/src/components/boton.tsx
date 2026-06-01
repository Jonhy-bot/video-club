import type { ReactNode } from 'react';

interface BotonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variante?: 'primario' | 'secundario';
  disabled?: boolean;
}

export const Boton: React.FC<BotonProps> = ({
  children,
  onClick,
  type = 'button',
  variante = 'primario',
  disabled = false
}) => {
  const base =
    'px-4 py-2 rounded text-sm font-medium transition-colors duration-150 disabled:opacity-50';
  const estilos =
    variante === 'primario' ?
      'bg-[#1877f2] hover:bg-[#166fe5] text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${estilos}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
