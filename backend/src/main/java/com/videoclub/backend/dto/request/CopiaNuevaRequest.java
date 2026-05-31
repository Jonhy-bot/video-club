package com.videoclub.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CopiaNuevaRequest {

    @NotNull(message = "El código del videojuego es obligatorio")
    private Integer codigoVideojuego;

    @NotNull(message = "El número de sucursal es obligatorio")
    private Integer numeroSucursal;

    @Size(max = 200, message = "El estado no puede superar 200 caracteres")
    private String estado;
}
