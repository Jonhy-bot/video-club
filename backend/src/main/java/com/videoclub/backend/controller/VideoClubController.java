package com.videoclub.backend.controller;

import com.videoclub.backend.model.*;
import com.videoclub.backend.service.VideoClubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<?> insertarCliente(@RequestBody Cliente cliente) {
        try {
            String mensaje = service.insertarCliente(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", mensaje));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/clientes/{cedula}")
    public ResponseEntity<?> obtenerClientePorCedula(@PathVariable String cedula) {
        try {
            return ResponseEntity.ok(service.obtenerClientePorCedula(cedula));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
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
    public ResponseEntity<?> insertarVideojuego(@RequestBody Videojuego videojuego) {
        try {
            String mensaje = service.insertarVideojuego(videojuego);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", mensaje));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/videojuegos/disponibles/{numeroSucursal}")
    public ResponseEntity<List<Videojuego>> listarVideojuegosDisponibles(
            @PathVariable Integer numeroSucursal) {
        return ResponseEntity.ok(service.listarVideojuegosDisponiblesPorSucursal(numeroSucursal));
    }

    // ---- COPIAS ----

    @PostMapping("/copias")
    public ResponseEntity<?> insertarCopia(@RequestBody Copia copia) {
        try {
            String mensaje = service.insertarCopia(copia);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", mensaje));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/copias/disponibles/{numeroSucursal}")
    public ResponseEntity<List<Copia>> listarCopiasDisponibles(@PathVariable Integer numeroSucursal) {
        return ResponseEntity.ok(service.listarCopiasDisponiblesPorSucursal(numeroSucursal));
    }

    @PostMapping("/copias/trasladar")
    public ResponseEntity<?> trasladarCopia(@RequestBody Copia copia) {
        try {
            String mensaje = service.trasladarCopia(copia);
            return ResponseEntity.ok(Map.of("mensaje", mensaje));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ---- ALQUILERES ----

    @PostMapping("/alquileres")
    public ResponseEntity<?> insertarAlquiler(@RequestBody Alquiler alquiler) {
        try {
            Map<String, Object> resultado = service.insertarAlquiler(alquiler);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/alquileres/activos/{cedula}")
    public ResponseEntity<List<Alquiler>> listarAlquileresActivos(@PathVariable String cedula) {
        return ResponseEntity.ok(service.listarAlquileresActivosPorCliente(cedula));
    }

    @PostMapping("/alquileres/regresar")
    public ResponseEntity<?> regresarVideojuego(@RequestBody Alquiler alquiler) {
        try {
            String mensaje = service.regresarVideojuego(alquiler);
            return ResponseEntity.ok(Map.of("mensaje", mensaje));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/alquileres/historial/{cedula}")
    public ResponseEntity<List<Alquiler>> listarHistorialAlquileres(@PathVariable String cedula) {
        return ResponseEntity.ok(service.listarHistorialAlquileresPorCliente(cedula));
    }
}
