package com.videoclub.backend.service;

import com.videoclub.backend.model.*;
import com.videoclub.backend.repository.VideoClubRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VideoClubService {

    private final VideoClubRepository repository;

    public VideoClubService(VideoClubRepository repository) {
        this.repository = repository;
    }

    private void validarMensaje(String mensaje) {
        if (mensaje != null && mensaje.startsWith("ERROR")) {
            throw new RuntimeException(mensaje);
        }
    }

    // ---- CLIENTES ----

    public List<Cliente> listarClientes() {
        try {
            return repository.listarClientes();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar clientes: " + e.getMessage(), e);
        }
    }

    public String insertarCliente(Cliente cliente) {
        try {
            String mensaje = repository.insertarCliente(
                cliente.getCedula(), cliente.getNombre(), cliente.getApellido(),
                cliente.getTelefono(), cliente.getCorreo(), cliente.getDireccion()
            );
            validarMensaje(mensaje);
            return mensaje;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al insertar cliente: " + e.getMessage(), e);
        }
    }

    public Cliente obtenerClientePorCedula(String cedula) {
        try {
            return repository.obtenerClientePorCedula(cedula)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con cédula: " + cedula));
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener cliente: " + e.getMessage(), e);
        }
    }

    // ---- CATEGORIAS ----

    public List<Categoria> listarCategorias() {
        try {
            return repository.listarCategorias();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar categorías: " + e.getMessage(), e);
        }
    }

    // ---- SUCURSALES ----

    public List<Sucursal> listarSucursales() {
        try {
            return repository.listarSucursales();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar sucursales: " + e.getMessage(), e);
        }
    }

    // ---- VIDEOJUEGOS ----

    public List<Videojuego> listarVideojuegos() {
        try {
            return repository.listarVideojuegos();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar videojuegos: " + e.getMessage(), e);
        }
    }

    public String insertarVideojuego(Videojuego videojuego) {
        try {
            String mensaje = repository.insertarVideojuego(
                videojuego.getCodigo(), videojuego.getNombre(), videojuego.getDescripcion(),
                videojuego.getDesarrollador(), videojuego.getFechaLanzamiento(),
                videojuego.getIdCategoria()
            );
            validarMensaje(mensaje);
            return mensaje;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al insertar videojuego: " + e.getMessage(), e);
        }
    }

    public List<Videojuego> listarVideojuegosDisponiblesPorSucursal(Integer numeroSucursal) {
        try {
            return repository.listarVideojuegosDisponiblesPorSucursal(numeroSucursal);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar videojuegos disponibles: " + e.getMessage(), e);
        }
    }

    // ---- COPIAS ----

    public String insertarCopia(Copia copia) {
        try {
            String mensaje = repository.insertarCopia(
                copia.getCodigoVideojuego(), copia.getNumeroSucursal(), copia.getEstado()
            );
            validarMensaje(mensaje);
            return mensaje;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al insertar copia: " + e.getMessage(), e);
        }
    }

    public List<Copia> listarCopiasDisponiblesPorSucursal(Integer numeroSucursal) {
        try {
            return repository.listarCopiasDisponiblesPorSucursal(numeroSucursal);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar copias disponibles: " + e.getMessage(), e);
        }
    }

    public String trasladarCopia(Copia copia) {
        try {
            String mensaje = repository.trasladarCopia(
                copia.getConsecutivo(), copia.getSucursalDestino(), copia.getComentarios()
            );
            validarMensaje(mensaje);
            return mensaje;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al trasladar copia: " + e.getMessage(), e);
        }
    }

    // ---- ALQUILERES ----

    public Map<String, Object> insertarAlquiler(Alquiler alquiler) {
        try {
            Map<String, Object> resultado = repository.insertarAlquiler(
                alquiler.getCedulaCliente(), alquiler.getCodigoJuego(),
                alquiler.getNumeroSucursal(), alquiler.getCantidadDias()
            );
            validarMensaje((String) resultado.get("Mensaje"));
            return resultado;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar alquiler: " + e.getMessage(), e);
        }
    }

    public List<Alquiler> listarAlquileresActivosPorCliente(String cedulaCliente) {
        try {
            return repository.listarAlquileresActivosPorCliente(cedulaCliente);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar alquileres activos: " + e.getMessage(), e);
        }
    }

    public String regresarVideojuego(Alquiler alquiler) {
        try {
            String mensaje = repository.regresarVideojuego(
                alquiler.getSecuencia(), alquiler.getDetalle()
            );
            validarMensaje(mensaje);
            return mensaje;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar devolución: " + e.getMessage(), e);
        }
    }

    public List<Alquiler> listarHistorialAlquileresPorCliente(String cedulaCliente) {
        try {
            return repository.listarHistorialAlquileresPorCliente(cedulaCliente);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al listar historial de alquileres: " + e.getMessage(), e);
        }
    }
}
