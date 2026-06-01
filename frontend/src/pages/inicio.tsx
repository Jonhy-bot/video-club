import React from 'react';
import { Tarjeta } from '../components/tarjeta';

export default function PaginaInicio(): React.JSX.Element {
  return (
    <div className='max-w-4xl mx-auto mt-6 px-4'>
      <Tarjeta titulo='Sistema de Gestión de Videojuegos y Alquileres'>
        <div className='space-y-4'>
          <p className='text-gray-600 leading-relaxed'>
            Bienvenido al panel administrativo. Utilice la barra de navegación
            superior para gestionar el catálogo de videojuegos, administrar los
            datos de los clientes y registrar las operaciones de alquiler,
            devoluciones y traslados de copias entre sucursales.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-4'>
            <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
              <h3 className='font-semibold text-gray-700 mb-1'>Clientes</h3>
              <p className='text-xs text-gray-500'>
                Registro y consulta de usuarios del sistema.
              </p>
            </div>
            <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
              <h3 className='font-semibold text-gray-700 mb-1'>Videojuegos</h3>
              <p className='text-xs text-gray-500'>
                Control de inventario, categorías y traslados.
              </p>
            </div>
            <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
              <h3 className='font-semibold text-gray-700 mb-1'>Alquileres</h3>
              <p className='text-xs text-gray-500'>
                Flujo de préstamos, retornos e historial.
              </p>
            </div>
          </div>
        </div>
      </Tarjeta>
    </div>
  );
}
