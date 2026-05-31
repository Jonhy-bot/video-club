package com.videoclub.backend.service;

import com.videoclub.backend.dto.request.*;
import com.videoclub.backend.exception.NotFoundException;
import com.videoclub.backend.exception.ServiceException;
import com.videoclub.backend.model.*;
import com.videoclub.backend.repository.VideoClubRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class VideoClubService {

    private final VideoClubRepository repository;

    public VideoClubService(VideoClubRepository repository) {
        this.repository = repository;
    }

    // ---- CLIENTES ----

    public List<Cliente> listarClientes() {
        return repository.listarClientes();
    }

    public String insertarCliente(ClienteRequest req) {
        log.info("Insertando cliente con cédula: {}", req.getCedula());
        String mensaje = repository.insertarCliente(
                req.getCedula(), req.getNombre(), req.getApellido(),
                req.getTelefono(), req.getCorreo(), req.getDireccion());
        validarMensaje(mensaje);
        return mensaje;
    }

    public Cliente obtenerClientePorCedula(String cedula) {
        return repository.obtenerClientePorCedula(cedula)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado con cédula: " + cedula));
    }

    // ---- CATEGORIAS ----

    public List<Categoria> listarCategorias() {
        return repository.listarCategorias();
    }

    // ---- SUCURSALES ----

    public List<Sucursal> listarSucursales() {
        return repository.listarSucursales();
    }

    // ---- VIDEOJUEGOS ----

    public List<Videojuego> listarVideojuegos() {
        return repository.listarVideojuegos();
    }

    public String insertarVideojuego(VideojuegoRequest req) {
        log.info("Insertando videojuego con código: {}", req.getCodigo());
        String mensaje = repository.insertarVideojuego(
                req.getCodigo(), req.getNombre(), req.getDescripcion(),
                req.getDesarrollador(), req.getFechaLanzamiento(), req.getIdCategoria());
        validarMensaje(mensaje);
        return mensaje;
    }

    public List<Videojuego> listarVideojuegosDisponiblesPorSucursal(Integer numeroSucursal) {
        return repository.listarVideojuegosDisponiblesPorSucursal(numeroSucursal);
    }

    // ---- COPIAS ----

    public String insertarCopia(CopiaNuevaRequest req) {
        log.info("Insertando copia del videojuego {} en sucursal {}", req.getCodigoVideojuego(), req.getNumeroSucursal());
        String mensaje = repository.insertarCopia(
                req.getCodigoVideojuego(), req.getNumeroSucursal(), req.getEstado());
        validarMensaje(mensaje);
        return mensaje;
    }

    public List<Copia> listarCopiasDisponiblesPorSucursal(Integer numeroSucursal) {
        return repository.listarCopiasDisponiblesPorSucursal(numeroSucursal);
    }

    public String trasladarCopia(TrasladoRequest req) {
        log.info("Trasladando copia {} a sucursal {}", req.getConsecutivoCopia(), req.getSucursalDestino());
        String mensaje = repository.trasladarCopia(
                req.getConsecutivoCopia(), req.getSucursalDestino(), req.getComentarios());
        validarMensaje(mensaje);
        return mensaje;
    }

    // ---- ALQUILERES ----

    public Map<String, Object> insertarAlquiler(AlquilerRequest req) {
        log.info("Registrando alquiler para cliente {} en sucursal {}", req.getCedulaCliente(), req.getNumeroSucursal());
        Map<String, Object> raw = repository.insertarAlquiler(
                req.getCedulaCliente(), req.getCodigoJuego(),
                req.getNumeroSucursal(), req.getCantidadDias());
        validarMensaje(String.valueOf(raw.get("Mensaje")));
        return Map.of(
                "secuenciaAlquiler", raw.get("SecuenciaAlquiler"),
                "mensaje", raw.get("Mensaje"));
    }

    public List<Alquiler> listarAlquileresActivosPorCliente(String cedulaCliente) {
        return repository.listarAlquileresActivosPorCliente(cedulaCliente);
    }

    public String regresarVideojuego(DevolucionRequest req) {
        log.info("Registrando devolución del alquiler #{}", req.getSecuencia());
        String mensaje = repository.regresarVideojuego(req.getSecuencia(), req.getDetalle());
        validarMensaje(mensaje);
        return mensaje;
    }

    public List<Alquiler> listarHistorialAlquileresPorCliente(String cedulaCliente) {
        return repository.listarHistorialAlquileresPorCliente(cedulaCliente);
    }

    private void validarMensaje(String mensaje) {
        if (mensaje != null && mensaje.startsWith("ERROR")) {
            throw new ServiceException(mensaje);
        }
    }
}
