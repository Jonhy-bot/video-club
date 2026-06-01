import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Tarjeta } from '../components/tarjeta';
import { Boton } from '../components/boton';
import { Carga } from '../components/carga';

interface Cliente {
  cedula: string;
  nombre: string;
}

interface AlquilerActivo {
  secuencia: number;
  fechaPrestamo: string;
  cantidadDias: number;
  codigoVideojuego: string;
  nombreVideojuego: string;
  consecutivoCopia: string;
  codigoSucursal: string;
  nombreSucursal: string;
}

interface HistorialAlquiler {
  secuencia: number;
  fechaPrestamo: string;
  cantidadDias: number;
  fechaDevolucion: string | null;
  codigoVideojuego: string;
  nombreVideojuego: string;
  consecutivoCopia: string;
}

export default function DetalleCliente(): React.JSX.Element {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [alquileresActivos, setAlquileresActivos] = useState<AlquilerActivo[]>(
    []
  );
  const [historial, setHistorial] = useState<HistorialAlquiler[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    if (!cedula) {
      navigate('/clientes');
      return;
    }

    const cargar = async (): Promise<void> => {
      setCargando(true);
      try {
        const resCli = await fetch(
          `http://localhost:8080/api/clientes/${cedula}`
        );
        if (resCli.ok) {
          setCliente(await resCli.json());
        }

        const [resActivos, resHist] = await Promise.all([
          fetch(`http://localhost:8080/api/alquileres/activos/${cedula}`),
          fetch(`http://localhost:8080/api/alquileres/historial/${cedula}`)
        ]);

        if (resActivos.ok) setAlquileresActivos(await resActivos.json());
        if (resHist.ok) setHistorial(await resHist.json());
      } catch (err) {
        console.error('Error cargando detalles', err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [cedula, navigate]);

  if (cargando) {
    return (
      <div className='max-w-6xl mx-auto mt-6 px-4'>
        <Carga />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className='max-w-6xl mx-auto mt-6 px-4'>
        <Tarjeta titulo='Error'>
          <p className='text-red-600'>Cliente no encontrado.</p>
          <div className='mt-4'>
            <Boton onClick={() => navigate('/clientes')}>Volver</Boton>
          </div>
        </Tarjeta>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto mt-6 px-4'>
      <div className='mb-6'>
        <Boton onClick={() => navigate('/clientes')}>← Volver a Clientes</Boton>
      </div>

      <Tarjeta titulo={`Cliente: ${cliente.nombre}`}>
        <div className='space-y-2 text-sm'>
          <p>
            <span className='font-semibold'>Cédula:</span> {cliente.cedula}
          </p>
          <p>
            <span className='font-semibold'>Nombre:</span> {cliente.nombre}
          </p>
        </div>
      </Tarjeta>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        <Tarjeta titulo='Alquileres Activos'>
          {alquileresActivos.length === 0 ?
            <p className='text-gray-500 text-sm'>No hay alquileres activos.</p>
          : <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                    <th className='p-2'>Secuencia</th>
                    <th className='p-2'>Juego</th>
                    <th className='p-2'>Copia</th>
                    <th className='p-2'>Sucursal</th>
                    <th className='p-2'>Préstamo</th>
                    <th className='p-2'>Días</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {alquileresActivos.map((a) => (
                    <tr
                      key={a.secuencia}
                      className='hover:bg-gray-50'
                    >
                      <td className='p-2 font-semibold'>{a.secuencia}</td>
                      <td className='p-2'>{a.nombreVideojuego}</td>
                      <td className='p-2'>#{a.consecutivoCopia}</td>
                      <td className='p-2'>{a.nombreSucursal}</td>
                      <td className='p-2'>{a.fechaPrestamo}</td>
                      <td className='p-2'>{a.cantidadDias}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </Tarjeta>

        <Tarjeta titulo='Historial Completo'>
          {historial.length === 0 ?
            <p className='text-gray-500 text-sm'>
              No hay historial de alquileres.
            </p>
          : <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                    <th className='p-2'>Secuencia</th>
                    <th className='p-2'>Juego</th>
                    <th className='p-2'>Copia</th>
                    <th className='p-2'>Préstamo</th>
                    <th className='p-2'>Devolución</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {historial.map((h) => (
                    <tr
                      key={h.secuencia}
                      className='hover:bg-gray-50'
                    >
                      <td className='p-2 font-semibold'>{h.secuencia}</td>
                      <td className='p-2'>{h.nombreVideojuego}</td>
                      <td className='p-2'>#{h.consecutivoCopia}</td>
                      <td className='p-2'>{h.fechaPrestamo}</td>
                      <td className='p-2'>
                        {h.fechaDevolucion ?
                          <span className='text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200'>
                            {h.fechaDevolucion}
                          </span>
                        : <span className='text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200'>
                            Activo
                          </span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </Tarjeta>
      </div>
    </div>
  );
}
