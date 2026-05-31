package com.videoclub.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlquilerRequest {

    @NotBlank(message = "La cédula del cliente es obligatoria")
    @Size(min = 9, max = 9, message = "La cédula debe tener exactamente 9 caracteres")
    private String cedulaCliente;

    @NotNull(message = "El código del juego es obligatorio")
    private Integer codigoJuego;

    @NotNull(message = "El número de sucursal es obligatorio")
    private Integer numeroSucursal;

    @NotNull(message = "La cantidad de días es obligatoria")
    @Min(value = 1, message = "La cantidad de días debe ser al menos 1")
    private Integer cantidadDias;
}
