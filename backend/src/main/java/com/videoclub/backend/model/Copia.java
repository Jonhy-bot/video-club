package com.videoclub.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Copia {
    private Integer consecutivo;
    private String estado;
    private String disponibilidad;
    private Integer codigoVideojuego;
    private String nombreVideojuego;
}
