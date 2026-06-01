package com.videoclub.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alquiler {
    private Integer secuencia;
    private LocalDateTime fechaPrestamo;
    private Integer cantidadDias;
    private Integer codigoVideojuego;
    private String nombreVideojuego;
    private Integer consecutivoCopia;
    private Integer numeroSucursal;
    private String nombreSucursal;
    private LocalDateTime fechaDevolucion;
    private String detalleDevolucion;
}
