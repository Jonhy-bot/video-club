import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Tarjeta } from '../components/tarjeta';
import { Alerta } from '../components/alerta';
import { InputForm } from '../components/input-form';
import { Boton } from '../components/boton';
import { Carga } from '../components/carga';
import { extraerErrorDelServidor } from '../utils/api';

interface Cliente {
  cedula: string;
  nombre: string;
}

interface FeedbackState {
  mensaje: string;
  tipo: 'success' | 'error' | '';
}

export default function PaginaClientes(): React.JSX.Element {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cedula, setCedula] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    mensaje: '',
    tipo: ''
  });

  const API_URL = 'http://localhost:8080/api/clientes';

  const cargarClientes = async (): Promise<void> => {
    setCargando(true);
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data: Cliente[] = await res.json();
        setClientes(data);
      } else {
        const error = await res.json();
        console.error('Error cargando clientes', error);
      }
    } catch (err) {
      console.error('Error cargando clientes', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!cedula || !nombre) return;

    setCargando(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, nombre })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          mensaje: 'Cliente creado exitosamente.',
          tipo: 'success'
        });
        setCedula('');
        setNombre('');
        cargarClientes();
      } else {
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch (err) {
      setFeedback({
        mensaje: 'Error de conexión con el servidor.',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div className='md:col-span-1'>
        <Tarjeta titulo='Ingresar Cliente'>
          <Alerta
            mensaje={feedback.mensaje}
            tipo={feedback.tipo}
          />
          <form onSubmit={manejarEnvio}>
            <InputForm
              label='Cédula'
              type='text'
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
            <InputForm
              label='Nombre Completo'
              type='text'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <div className='mt-4'>
              <Boton type='submit'>Guardar Cliente</Boton>
            </div>
          </form>
        </Tarjeta>
      </div>

      <div className='md:col-span-2'>
        <Tarjeta titulo='Listado de Clientes'>
          {cargando ?
            <Carga />
          : <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse text-sm'>
                <thead>
                  <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                    <th className='p-3'>Cédula</th>
                    <th className='p-3'>Nombre</th>
                    <th className='p-3'>Acción</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {clientes.length === 0 ?
                    <tr>
                      <td
                        colSpan={3}
                        className='p-3 text-center text-gray-500'
                      >
                        No hay clientes registrados.
                      </td>
                    </tr>
                  : clientes.map((cli) => (
                      <tr
                        key={cli.cedula}
                        className='hover:bg-gray-50'
                      >
                        <td className='p-3 font-medium text-gray-800'>
                          {cli.cedula}
                        </td>
                        <td className='p-3 text-gray-600'>{cli.nombre}</td>
                        <td className='p-3'>
                          <button
                            onClick={() => navigate(`/clientes/${cli.cedula}`)}
                            className='px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition'
                          >
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          }
        </Tarjeta>
      </div>
    </div>
  );
}
