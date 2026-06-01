import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Tarjeta } from '../components/tarjeta';
import { InputForm } from '../components/input-form';
import { Boton } from '../components/boton';
import { Alerta } from '../components/alerta';
import { SelectForm } from '../components/select-form';
import { Carga } from '../components/carga';
import { extraerErrorDelServidor } from '../utils/api';

interface Cliente {
  cedula: string;
  nombre: string;
}

interface Sucursal {
  numero: number;
  nombre: string;
}

interface VideojuegoDisponible {
  codigoVideojuego: number;
  consecutivo: number;
  disponibilidad: string;
  estado: string;
  nombreVideojuego: string;
}

interface AlquilerActivo {
  secuencia: number;
  fechaPrestamo: string;
  cantidadDias: number;
  codigoVideojuego: number;
  nombreVideojuego: string;
  consecutivoCopia: number;
  numeroSucursal: number;
  nombreSucursal: string;
}

interface HistorialAlquiler {
  secuencia: number;
  fechaPrestamo: string;
  cantidadDias: number;
  fechaDevolucion: string | null;
  codigoVideojuego: number;
  nombreVideojuego: string;
  consecutivoCopia: number;
}

interface AlquilerSistema {
  secuencia: number;
  fechaPrestamo: string;
  cantidadDias: number;
  fechaDevolucion: string | null;
  codigoVideojuego: number;
  nombreVideojuego: string;
  consecutivoCopia: number;
  numeroSucursal: number;
  nombreSucursal: string;
  cedulaCliente: string;
  nombreCliente: string;
}

interface FeedbackState {
  mensaje: string;
  tipo: 'success' | 'error' | '';
}

export default function PaginaAlquileres(): React.JSX.Element {
  const [cedulaBusqueda, setCedulaBusqueda] = useState<string>('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [juegosDisponibles, setJuegosDisponibles] = useState<
    VideojuegoDisponible[]
  >([]);

  const [alquileresActivos, setAlquileresActivos] = useState<AlquilerActivo[]>(
    []
  );
  const [historial, setHistorial] = useState<HistorialAlquiler[]>([]);
  const [alquileresSistema, setAlquileresSistema] = useState<AlquilerSistema[]>(
    []
  );

  const [alquilerForm, setAlquilerForm] = useState({
    cedulaCliente: '',
    codigoJuego: '',
    numeroSucursal: '',
    cantidadDias: ''
  });
  const [devolucionForm, setDevolucionForm] = useState({
    idAlquiler: '',
    detalle: '',
    diasAtraso: 0
  });
  const [feedback, setFeedback] = useState<FeedbackState>({
    mensaje: '',
    tipo: ''
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/alquileres');
        if (res.ok) {
          setAlquileresSistema(await res.json());
        }
      } catch {
        // Error fetching, dejar array vacío
      }
    })();
  }, []);

  const buscarCliente = async (): Promise<void> => {
    if (!cedulaBusqueda) return;
    setCargando(true);
    try {
      const resCli = await fetch(
        `http://localhost:8080/api/clientes/${cedulaBusqueda}`
      );
      if (resCli.ok) {
        const dataCli: Cliente = await resCli.json();
        setCliente(dataCli);
        setFeedback({ mensaje: '', tipo: '' });

        const resSuc = await fetch('http://localhost:8080/api/sucursales');
        if (resSuc.ok) setSucursales(await resSuc.json());

        actualizarAlquileresYHistorial(dataCli.cedula);
      } else {
        setCliente(null);
        const data = await resCli.json();
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch {
      setFeedback({
        mensaje: 'Error al conectar con el servidor.',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
    }
  };

  const actualizarAlquileresYHistorial = async (ced: string): Promise<void> => {
    try {
      const [resActivos, resHist] = await Promise.all([
        fetch(`http://localhost:8080/api/alquileres/activos/${ced}`),
        fetch(`http://localhost:8080/api/alquileres/historial/${ced}`)
      ]);
      if (resActivos.ok) setAlquileresActivos(await resActivos.json());
      if (resHist.ok) setHistorial(await resHist.json());
    } catch (err) {
      console.error(err);
    }
  };

  const manejarCambioSucursalAlquiler = async (
    idSucursal: string
  ): Promise<void> => {
    setAlquilerForm({
      ...alquilerForm,
      numeroSucursal: idSucursal,
      codigoJuego: ''
    });
    if (!idSucursal) {
      setJuegosDisponibles([]);
      return;
    }
    try {
      const numero = parseInt(String(idSucursal));
      const res = await fetch(
        `http://localhost:8080/api/copias/disponibles/${numero}`
      );
      if (res.ok) {
        setJuegosDisponibles(await res.json());
      } else {
        setJuegosDisponibles([]);
      }
    } catch {
      setJuegosDisponibles([]);
    }
  };

  const registrarAlquiler = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!cliente) return;
    setCargando(true);
    try {
      const res = await fetch('http://localhost:8080/api/alquileres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedulaCliente: cliente.cedula,
          codigoJuego: alquilerForm.codigoJuego,
          numeroSucursal: alquilerForm.numeroSucursal,
          cantidadDias: alquilerForm.cantidadDias
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          mensaje: `Alquiler exitoso. Secuencia asignada: ${data.secuencia}`,
          tipo: 'success'
        });
        setAlquilerForm({
          cantidadDias: '',
          cedulaCliente: '',
          codigoJuego: '',
          numeroSucursal: ''
        });
        actualizarAlquileresYHistorial(cliente.cedula);
      } else {
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch {
      setFeedback({ mensaje: 'Error en la petición.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const seleccionarAlquilerRetorno = (idAlquiler: string): void => {
    if (!idAlquiler) {
      setDevolucionForm({ idAlquiler: '', detalle: '', diasAtraso: 0 });
      return;
    }
    const Alq = alquileresActivos.find(
      (a) => a.secuencia === parseInt(idAlquiler)
    );
    if (!Alq) return;

    const fechaPrestamo = new Date(Alq.fechaPrestamo);
    const fechaActual = new Date();
    const diferenciaTiempo = fechaActual.getTime() - fechaPrestamo.getTime();
    const diasTranscurridos = Math.floor(diferenciaTiempo / (1000 * 3600 * 24));
    const atraso = diasTranscurridos - Alq.cantidadDias;

    let mensajeDetalle = '';
    if (atraso > 0) {
      mensajeDetalle = `Devolución con retraso de ${atraso} días. `;
    }

    setDevolucionForm({
      idAlquiler,
      detalle: mensajeDetalle,
      diasAtraso: atraso > 0 ? atraso : 0
    });
  };

  const ejecutarDevolucion = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!cliente) return;
    setCargando(true);
    try {
      const res = await fetch('http://localhost:8080/api/alquileres/regresar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secuencia: devolucionForm.idAlquiler,
          detalle: devolucionForm.detalle.substring(0, 200)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          mensaje: 'Videojuego regresado de manera correcta.',
          tipo: 'success'
        });
        setDevolucionForm({ idAlquiler: '', detalle: '', diasAtraso: 0 });
        actualizarAlquileresYHistorial(cliente.cedula);
      } else {
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch {
      setFeedback({ mensaje: 'Error de red.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='max-w-7xl mx-auto mt-6 px-4'>
      <Tarjeta titulo='Todos los Alquileres del Sistema'>
        {alquileresSistema.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs border-collapse'>
              <thead>
                <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                  <th className='p-3'>Secuencia</th>
                  <th className='p-3'>Cliente</th>
                  <th className='p-3'>Cédula</th>
                  <th className='p-3'>Videojuego</th>
                  <th className='p-3'>Fecha Préstamo</th>
                  <th className='p-3'>Días Pactados</th>
                  <th className='p-3'>Fecha Devolución</th>
                  <th className='p-3'>Sucursal</th>
                </tr>
              </thead>
              <tbody>
                {alquileresSistema.map((a) => (
                  <tr
                    key={a.secuencia}
                    className={`border-b border-gray-200 ${
                      a.fechaDevolucion
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <td className='p-3 font-semibold text-blue-700'>
                      {a.secuencia}
                    </td>
                    <td className='p-3'>{a.nombreCliente}</td>
                    <td className='p-3 font-mono text-xs'>{a.cedulaCliente}</td>
                    <td className='p-3'>{a.nombreVideojuego}</td>
                    <td className='p-3'>
                      {new Date(a.fechaPrestamo).toLocaleDateString()}
                    </td>
                    <td className='p-3 text-center'>{a.cantidadDias}</td>
                    <td className='p-3'>
                      {a.fechaDevolucion ? (
                        <span className='text-green-700 font-semibold'>
                          {new Date(a.fechaDevolucion).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className='text-red-700 font-semibold'>Activo</span>
                      )}
                    </td>
                    <td className='p-3'>{a.nombreSucursal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-gray-500 italic'>Cargando alquileres del sistema...</p>
        )}
      </Tarjeta>

      <Tarjeta titulo='Identificación del Cliente'>
        <div className='flex gap-3 items-end max-w-md'>
          <div className='flex-1'>
            <InputForm
              label='Ingrese la Cédula del Cliente'
              type='text'
              value={cedulaBusqueda}
              onChange={(e) => setCedulaBusqueda(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Boton onClick={buscarCliente}>Buscar Cliente</Boton>
          </div>
        </div>
        {cliente && (
          <p className='text-sm mt-2 text-green-700 font-medium'>
            Cliente activo: <span className='underline'>{cliente.nombre}</span>{' '}
            ({cliente.cedula})
          </p>
        )}
      </Tarjeta>

      <Alerta
        mensaje={feedback.mensaje}
        tipo={feedback.tipo}
      />

      {cliente && (
        <>
          <Tarjeta titulo='Alquileres Activos'>
            {cargando ?
              <Carga />
            : alquileresActivos.length > 0 ?
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-xs border-collapse'>
                  <thead>
                    <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                      <th className='p-3'>Secuencia</th>
                      <th className='p-3'>Videojuego</th>
                      <th className='p-3'>Fecha Préstamo</th>
                      <th className='p-3'>Días Pactados</th>
                      <th className='p-3'>Sucursal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alquileresActivos.map((a) => (
                      <tr
                        key={a.secuencia}
                        className='border-b border-gray-200 hover:bg-gray-50'
                      >
                        <td className='p-3 font-semibold text-blue-700'>
                          {a.secuencia}
                        </td>
                        <td className='p-3'>{a.nombreVideojuego}</td>
                        <td className='p-3'>
                          {new Date(a.fechaPrestamo).toLocaleDateString()}
                        </td>
                        <td className='p-3 text-center'>{a.cantidadDias}</td>
                        <td className='p-3'>{a.nombreSucursal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            : <p className='text-gray-500 italic'>
                No hay alquileres activos para este cliente.
              </p>
            }
          </Tarjeta>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
            <Tarjeta titulo='Registrar Nuevo Alquiler'>
              <form onSubmit={registrarAlquiler}>
                <SelectForm
                  label='Sucursal Origen'
                  value={alquilerForm.numeroSucursal}
                  onChange={(e) =>
                    manejarCambioSucursalAlquiler(e.target.value)
                  }
                  required
                >
                  <option
                    key='default'
                    value=''
                  >
                    Seleccione...
                  </option>
                  {sucursales.map((s) => (
                    <option
                      key={s.nombre + s.numero}
                      value={String(s.numero)}
                    >
                      {s.nombre}
                    </option>
                  ))}
                </SelectForm>

                <SelectForm
                  label='Videojuegos Disponibles'
                  value={alquilerForm.codigoJuego}
                  onChange={(e) =>
                    setAlquilerForm({
                      ...alquilerForm,
                      codigoJuego: e.target.value
                    })
                  }
                  required
                  disabled={!alquilerForm.numeroSucursal}
                >
                  <option
                    key='default'
                    value=''
                  >
                    Seleccione...
                  </option>
                  {juegosDisponibles.map((j) => (
                    <option
                      key={j.codigoVideojuego}
                      value={String(j.codigoVideojuego)}
                    >
                      {j.nombreVideojuego}
                    </option>
                  ))}
                </SelectForm>

                <InputForm
                  label='Cantidad de Días'
                  type='number'
                  min='1'
                  value={alquilerForm.cantidadDias}
                  onChange={(e) =>
                    setAlquilerForm({ ...alquilerForm, cantidadDias: e.target.value })
                  }
                  required
                />
                <Boton type='submit'>Confirmar Alquiler</Boton>
              </form>
            </Tarjeta>

            <Tarjeta titulo='Regresar Videojuego'>
              <form onSubmit={ejecutarDevolucion}>
                <SelectForm
                  label='Seleccionar Alquiler Activo'
                  value={devolucionForm.idAlquiler}
                  onChange={(e) => seleccionarAlquilerRetorno(e.target.value)}
                  required
                >
                  <option
                    key='default'
                    value=''
                  >
                    Seleccione...
                  </option>
                  {alquileresActivos.map((a) => (
                    <option
                      key={a.secuencia}
                      value={a.secuencia}
                    >
                      Secuencia: {a.secuencia} | {a.nombreVideojuego} (Copia: #
                      {a.consecutivoCopia})
                    </option>
                  ))}
                </SelectForm>

                {devolucionForm.idAlquiler && (
                  <>
                    {devolucionForm.diasAtraso > 0 && (
                      <div className='p-2 mb-3 bg-amber-50 text-amber-800 border border-amber-200 text-xs rounded font-semibold'>
                        Atención: El préstamo registra{' '}
                        {devolucionForm.diasAtraso} día(s) de atraso.
                      </div>
                    )}
                    <div className='mb-3'>
                      <label className='block text-xs font-semibold text-gray-600 uppercase mb-1'>
                        Detalle de Retorno (Máx 200 caracteres)
                      </label>
                      <textarea
                        value={devolucionForm.detalle}
                        onChange={(e) =>
                          setDevolucionForm({
                            ...devolucionForm,
                            detalle: e.target.value
                          })
                        }
                        maxLength={200}
                        className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1877f2]'
                        rows={3}
                      />
                    </div>
                    <Boton type='submit'>Procesar Retorno</Boton>
                  </>
                )}
              </form>
            </Tarjeta>

            <div className='lg:col-span-2'>
              <Tarjeta titulo='Historial Completo de Alquileres (Activos y Regresados)'>
                {cargando ?
                  <Carga />
                : <div className='overflow-x-auto'>
                    <table className='w-full text-left text-xs border-collapse'>
                      <thead>
                        <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                          <th className='p-3'>Secuencia</th>
                          <th className='p-3'>Préstamo</th>
                          <th className='p-3'>Días Pactados</th>
                          <th className='p-3'>Devolución</th>
                          <th className='p-3'>Videojuego</th>
                          <th className='p-3'>Copia #</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {historial.length === 0 ?
                          <tr>
                            <td
                              colSpan={6}
                              className='p-3 text-center text-gray-500'
                            >
                              Ningún registro en el histórico.
                            </td>
                          </tr>
                        : historial.map((h) => (
                            <tr
                              key={h.secuencia}
                              className='hover:bg-gray-50'
                            >
                              <td className='p-3 font-semibold'>
                                {h.secuencia}
                              </td>
                              <td className='p-3 text-gray-600'>
                                {h.fechaPrestamo}
                              </td>
                              <td className='p-3 text-gray-600'>
                                {h.cantidadDias}
                              </td>
                              <td className='p-3'>
                                {h.fechaDevolucion ?
                                  <span className='text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200'>
                                    {h.fechaDevolucion}
                                  </span>
                                : <span className='text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200'>
                                    Activo
                                  </span>
                                }
                              </td>
                              <td className='p-3 text-gray-700 font-medium'>
                                {h.nombreVideojuego}
                              </td>
                              <td className='p-3 text-gray-500'>
                                #{h.consecutivoCopia}
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
        </>
      )}
    </div>
  );
}
