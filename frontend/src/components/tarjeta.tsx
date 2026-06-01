import type { ReactNode } from 'react';

interface TarjetaProps {
  titulo?: string;
  children: ReactNode;
}

export const Tarjeta: React.FC<TarjetaProps> = ({ titulo, children }) => (
  <div className='bg-white border border-gray-300 rounded-lg shadow-sm mb-6'>
    {titulo && (
      <div className='px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 rounded-t-lg'>
        {titulo}
      </div>
    )}
    <div className='p-4'>{children}</div>
  </div>
);
