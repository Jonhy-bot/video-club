package com.videoclub.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Videojuego {
    private Integer codigo;
    private String nombre;
    private String descripcion;
    private String desarrollador;
    private LocalDate fechaLanzamiento;
    private String nombreCategoria;
    private Integer idCategoria;
}
