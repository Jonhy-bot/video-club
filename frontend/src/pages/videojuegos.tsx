import React, { useState, useEffect, FormEvent } from 'react';
import { Alerta } from '../components/alerta';
import { Tarjeta } from '../components/tarjeta';
import { InputForm } from '../components/input-form';
import { SelectForm } from '../components/select-form';
import { Boton } from '../components/boton';
import { Carga } from '../components/carga';
import { extraerErrorDelServidor } from '../utils/api';

interface Videojuego {
  codigo: number;
  nombre: string;
  descripcion?: string;
  desarrollador?: string;
  fechaLanzamiento?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  detalle: string;
}

interface Sucursal {
  numero: number;
  nombre: string;
}

interface CopiaDisponible {
  consecutivo: number;
  estado: string;
  disponibilidad?: string;
  codigoVideojuego: number;
  nombreVideojuego: string;
}

interface FeedbackState {
  mensaje: string;
  tipo: 'success' | 'error' | '';
}

export default function PaginaVideojuegos(): React.JSX.Element {
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const [nuevoJuego, setNuevoJuego] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    desarrollador: '',
    fechaLanzamiento: '',
    idCategoria: ''
  });
  const [nuevaCopia, setNuevaCopia] = useState({
    idVideojuego: '',
    idSucursal: '',
    comentario: ''
  });

  const [traslado, setTraslado] = useState({
    idSucursalOrigen: '',
    idCopia: '',
    idSucursalDestino: ''
  });
  const [copiasDisponibles, setCopiasDisponibles] = useState<CopiaDisponible[]>(
    []
  );

  const [feedback, setFeedback] = useState<FeedbackState>({
    mensaje: '',
    tipo: ''
  });

  const cargarDatosIniciales = async (): Promise<void> => {
    setCargando(true);
    try {
      const [resJuegos, resCats, resSuc] = await Promise.all([
        fetch('http://localhost:8080/api/videojuegos'),
        fetch('http://localhost:8080/api/categorias'),
        fetch('http://localhost:8080/api/sucursales')
      ]);
      if (resJuegos.ok) setVideojuegos(await resJuegos.json());
      if (resCats.ok) setCategorias(await resCats.json());
      if (resSuc.ok) setSucursales(await resSuc.json());
    } catch (err) {
      console.error('Error al sincronizar catálogos', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (traslado.idSucursalOrigen) {
      const numero = parseInt(String(traslado.idSucursalOrigen));
      fetch(`http://localhost:8080/api/copias/disponibles/${numero}`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data: CopiaDisponible[]) => setCopiasDisponibles(data))
        .catch(() => setCopiasDisponibles([]));
    } else {
      setCopiasDisponibles([]);
    }
  }, [traslado.idSucursalOrigen]);

  const crearVideojuego = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    try {
      const payload = {
        codigo: parseInt(nuevoJuego.codigo || '0'),
        nombre: nuevoJuego.nombre,
        descripcion: nuevoJuego.descripcion,
        desarrollador: nuevoJuego.desarrollador,
        fechaLanzamiento: nuevoJuego.fechaLanzamiento,
        idCategoria: parseInt(nuevoJuego.idCategoria || '0')
      };
      const res = await fetch('http://localhost:8080/api/videojuegos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          mensaje: 'Videojuego creado con éxito.',
          tipo: 'success'
        });
        setNuevoJuego({
          codigo: '',
          nombre: '',
          descripcion: '',
          desarrollador: '',
          fechaLanzamiento: '',
          idCategoria: ''
        });
        await cargarDatosIniciales();
      } else {
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch {
      setFeedback({ mensaje: 'Error de comunicación.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const crearCopia = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    try {
      const payload = {
        codigoVideojuego: parseInt(nuevaCopia.idVideojuego || '0'),
        numeroSucursal: parseInt(nuevaCopia.idSucursal || '0'),
        estado: nuevaCopia.comentario
      };
      const res = await fetch('http://localhost:8080/api/copias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          mensaje: 'Copia registrada correctamente.',
          tipo: 'success'
        });
        setNuevaCopia({ idVideojuego: '', idSucursal: '', comentario: '' });
      } else {
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch {
      setFeedback({ mensaje: 'Error de comunicación.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const ejecutarTraslado = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    try {
      const payload = {
        consecutivoCopia: parseInt(traslado.idCopia || '0'),
        sucursalDestino: parseInt(traslado.idSucursalDestino || '0'),
        comentarios: ''
      };
      const res = await fetch('http://localhost:8080/api/copias/trasladar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          mensaje: 'Traslado ejecutado con éxito.',
          tipo: 'success'
        });
        setTraslado({
          idSucursalOrigen: '',
          idCopia: '',
          idSucursalDestino: ''
        });
      } else {
        setFeedback({
          mensaje: extraerErrorDelServidor(data),
          tipo: 'error'
        });
      }
    } catch {
      setFeedback({ mensaje: 'Error de comunicación.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='max-w-7xl mx-auto mt-6 px-4'>
      <Alerta
        mensaje={feedback.mensaje}
        tipo={feedback.tipo}
      />

      <div className='mb-6'>
        <Tarjeta titulo='Catálogo General'>
          {cargando ?
            <Carga />
          : <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='border-b border-gray-300 bg-gray-100 text-gray-600 font-semibold'>
                    <th className='p-3'>Código</th>
                    <th className='p-3'>Nombre</th>
                    <th className='p-3'>Descripción</th>
                    <th className='p-3'>Desarrollador</th>
                    <th className='p-3'>Lanzamiento</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {videojuegos.length === 0 ?
                    <tr>
                      <td
                        colSpan={5}
                        className='p-3 text-center text-gray-500'
                      >
                        No hay videojuegos registrados.
                      </td>
                    </tr>
                  : videojuegos.map((v) => (
                      <tr
                        key={v.codigo}
                        className='hover:bg-gray-50'
                      >
                        <td className='p-3 font-mono font-semibold'>
                          {v.codigo}
                        </td>
                        <td className='p-3 font-medium'>{v.nombre}</td>
                        <td className='p-3 text-gray-600'>
                          {v.descripcion || '—'}
                        </td>
                        <td className='p-3 text-gray-600'>
                          {v.desarrollador || '—'}
                        </td>
                        <td className='p-3 text-gray-600'>
                          {v.fechaLanzamiento || '—'}
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

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='space-y-6'>
          <Tarjeta titulo='Ingresar Videojuego'>
            <form onSubmit={crearVideojuego}>
              <InputForm
                label='Código'
                type='text'
                value={nuevoJuego.codigo}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, codigo: e.target.value })
                }
                required
              />
              <InputForm
                label='Nombre'
                type='text'
                value={nuevoJuego.nombre}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, nombre: e.target.value })
                }
                required
              />
              <InputForm
                label='Descripción'
                type='text'
                value={nuevoJuego.descripcion}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, descripcion: e.target.value })
                }
                required
              />
              <InputForm
                label='Desarrollador'
                type='text'
                value={nuevoJuego.desarrollador}
                onChange={(e) =>
                  setNuevoJuego({
                    ...nuevoJuego,
                    desarrollador: e.target.value
                  })
                }
                required
              />
              <InputForm
                label='Fecha de Lanzamiento'
                type='date'
                value={nuevoJuego.fechaLanzamiento}
                onChange={(e) =>
                  setNuevoJuego({
                    ...nuevoJuego,
                    fechaLanzamiento: e.target.value
                  })
                }
                required
              />
              <SelectForm
                label='Categoría'
                value={nuevoJuego.idCategoria}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, idCategoria: e.target.value })
                }
                required
              >
                <option
                  key='default'
                  value=''
                >
                  Seleccione...
                </option>
                {categorias.map((cat) => (
                  <option
                    key={cat.id}
                    value={String(cat.id)}
                  >
                    {cat.nombre} - {cat.detalle}
                  </option>
                ))}
              </SelectForm>
              <Boton type='submit'>Ingresar Juego</Boton>
            </form>
          </Tarjeta>

          <Tarjeta titulo='Ingresar Copia'>
            <form onSubmit={crearCopia}>
              <SelectForm
                label='Videojuego'
                value={nuevaCopia.idVideojuego}
                onChange={(e) =>
                  setNuevaCopia({ ...nuevaCopia, idVideojuego: e.target.value })
                }
                required
              >
                <option
                  key='default'
                  value=''
                >
                  Seleccione...
                </option>
                {videojuegos.map((v) => (
                  <option
                    key={v.codigo}
                    value={String(v.codigo)}
                  >
                    {v.nombre}
                  </option>
                ))}
              </SelectForm>
              <SelectForm
                label='Sucursal'
                value={nuevaCopia.idSucursal}
                onChange={(e) =>
                  setNuevaCopia({ ...nuevaCopia, idSucursal: e.target.value })
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
                    key={s.numero}
                    value={String(s.numero)}
                  >
                    {s.nombre}
                  </option>
                ))}
              </SelectForm>
              <InputForm
                label='Comentarios (Opcional)'
                type='text'
                value={nuevaCopia.comentario}
                onChange={(e) =>
                  setNuevaCopia({ ...nuevaCopia, comentario: e.target.value })
                }
              />
              <Boton type='submit'>Registrar Copia</Boton>
            </form>
          </Tarjeta>
        </div>

        <div className='lg:col-span-2'>
          <Tarjeta titulo='Trasladar Copia entre Sucursales'>
            <form onSubmit={ejecutarTraslado}>
              <SelectForm
                label='Sucursal Origen'
                value={traslado.idSucursalOrigen}
                onChange={(e) =>
                  setTraslado({
                    ...traslado,
                    idSucursalOrigen: e.target.value,
                    idCopia: '',
                    idSucursalDestino: ''
                  })
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
                    key={s.numero}
                    value={String(s.numero)}
                  >
                    {s.nombre}
                  </option>
                ))}
              </SelectForm>

              <SelectForm
                label='Copias Disponibles (S)'
                value={traslado.idCopia}
                onChange={(e) =>
                  setTraslado({ ...traslado, idCopia: e.target.value })
                }
                required
                disabled={!traslado.idSucursalOrigen}
              >
                <option
                  key='default'
                  value=''
                >
                  Seleccione...
                </option>
                {copiasDisponibles.map((c) => (
                  <option
                    key={c.consecutivo}
                    value={String(c.consecutivo)}
                  >
                    Juego: {c.nombreVideojuego} ({c.codigoVideojuego}) | Copia:
                    #{c.consecutivo} - {c.estado}
                  </option>
                ))}
              </SelectForm>

              <SelectForm
                label='Sucursal Destino'
                value={traslado.idSucursalDestino}
                onChange={(e) =>
                  setTraslado({
                    ...traslado,
                    idSucursalDestino: e.target.value
                  })
                }
                required
                disabled={!traslado.idCopia}
              >
                <option
                  key='default'
                  value=''
                >
                  Seleccione...
                </option>
                {sucursales
                  .filter((s) => String(s.numero) !== traslado.idSucursalOrigen)
                  .map((s) => (
                    <option
                      key={s.numero}
                      value={String(s.numero)}
                    >
                      {s.nombre}
                    </option>
                  ))}
              </SelectForm>

              <Boton
                type='submit'
                disabled={!traslado.idSucursalDestino}
              >
                Realizar Traslado
              </Boton>
            </form>
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}
