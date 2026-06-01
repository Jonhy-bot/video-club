package com.videoclub.backend.controller;

import com.videoclub.backend.dto.request.*;
import com.videoclub.backend.model.*;
import com.videoclub.backend.service.VideoClubService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class VideoClubController {

    private final VideoClubService service;

    public VideoClubController(VideoClubService service) {
        this.service = service;
    }

    // ---- CLIENTES ----

    @GetMapping("/clientes")
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(service.listarClientes());
    }

    @PostMapping("/clientes")
    public ResponseEntity<Map<String, String>> insertarCliente(@Valid @RequestBody ClienteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", service.insertarCliente(req)));
    }

    @GetMapping("/clientes/{cedula}")
    public ResponseEntity<Cliente> obtenerClientePorCedula(@PathVariable String cedula) {
        return ResponseEntity.ok(service.obtenerClientePorCedula(cedula));
    }

    // ---- CATEGORIAS ----

    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(service.listarCategorias());
    }

    // ---- SUCURSALES ----

    @GetMapping("/sucursales")
    public ResponseEntity<List<Sucursal>> listarSucursales() {
        return ResponseEntity.ok(service.listarSucursales());
    }

    // ---- VIDEOJUEGOS ----

    @GetMapping("/videojuegos")
    public ResponseEntity<List<Videojuego>> listarVideojuegos() {
        return ResponseEntity.ok(service.listarVideojuegos());
    }

    @PostMapping("/videojuegos")
    public ResponseEntity<Map<String, String>> insertarVideojuego(@Valid @RequestBody VideojuegoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", service.insertarVideojuego(req)));
    }

    @GetMapping("/videojuegos/disponibles/{numeroSucursal}")
    public ResponseEntity<List<Videojuego>> listarVideojuegosDisponibles(@PathVariable Integer numeroSucursal) {
        return ResponseEntity.ok(service.listarVideojuegosDisponiblesPorSucursal(numeroSucursal));
    }

    // ---- COPIAS ----

    @PostMapping("/copias")
    public ResponseEntity<Map<String, String>> insertarCopia(@Valid @RequestBody CopiaNuevaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", service.insertarCopia(req)));
    }

    @GetMapping("/copias/disponibles/{numeroSucursal}")
    public ResponseEntity<List<Copia>> listarCopiasDisponibles(@PathVariable Integer numeroSucursal) {
        return ResponseEntity.ok(service.listarCopiasDisponiblesPorSucursal(numeroSucursal));
    }

    @PostMapping("/copias/trasladar")
    public ResponseEntity<Map<String, String>> trasladarCopia(@Valid @RequestBody TrasladoRequest req) {
        return ResponseEntity.ok(Map.of("mensaje", service.trasladarCopia(req)));
    }

    // ---- ALQUILERES ----

    @GetMapping("/alquileres")
    public ResponseEntity<List<Alquiler>> listarAlquileresActivos() {
        return ResponseEntity.ok(service.listarAlquileres());
    }

    @PostMapping("/alquileres")
    public ResponseEntity<Map<String, Object>> insertarAlquiler(@Valid @RequestBody AlquilerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.insertarAlquiler(req));
    }

    @GetMapping("/alquileres/activos/{cedula}")
    public ResponseEntity<List<Alquiler>> listarAlquileresActivos(@PathVariable String cedula) {
        return ResponseEntity.ok(service.listarAlquileresActivosPorCliente(cedula));
    }

    @PostMapping("/alquileres/regresar")
    public ResponseEntity<Map<String, String>> regresarVideojuego(@Valid @RequestBody DevolucionRequest req) {
        return ResponseEntity.ok(Map.of("mensaje", service.regresarVideojuego(req)));
    }

    @GetMapping("/alquileres/historial/{cedula}")
    public ResponseEntity<List<Alquiler>> listarHistorialAlquileres(@PathVariable String cedula) {
        return ResponseEntity.ok(service.listarHistorialAlquileresPorCliente(cedula));
    }
}
