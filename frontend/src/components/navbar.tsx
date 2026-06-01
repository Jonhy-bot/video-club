import React from 'react';
import { NavLink } from 'react-router';

export const Navbar: React.FC = () => {
  const linkBase =
    'px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150';

  const manejarClaseActiva = ({ isActive }: { isActive: boolean }) =>
    isActive ?
      `${linkBase} border-[#1877f2] text-[#1877f2]`
    : `${linkBase} border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900`;

  return (
    <header className='bg-white border-b border-gray-300 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between h-14'>
        {/* Logo / Identificador */}
        <div className='flex items-center gap-2'>
          <div className='bg-[#1877f2] text-white font-bold rounded-md w-8 h-8 flex items-center justify-center text-xl tracking-tighter'>
            v
          </div>
          <span className='font-semibold text-gray-800 text-base tracking-tight hidden sm:inline'>
            Video Club Admin
          </span>
        </div>

        {/* Menú de Navegación */}
        <nav className='flex h-full items-end space-x-2'>
          <NavLink
            to='/'
            className={manejarClaseActiva}
          >
            Inicio
          </NavLink>
          <NavLink
            to='/clientes'
            className={manejarClaseActiva}
          >
            Clientes
          </NavLink>
          <NavLink
            to='/videojuegos'
            className={manejarClaseActiva}
          >
            Videojuegos
          </NavLink>
          <NavLink
            to='/alquileres'
            className={manejarClaseActiva}
          >
            Alquileres
          </NavLink>
        </nav>

        {/* Indicador de Entorno de Datos */}
        <div className='text-xs font-mono bg-gray-100 border border-gray-300 text-gray-500 px-2 py-1 rounded'>
          localhost:8080
        </div>
      </div>
    </header>
  );
};
