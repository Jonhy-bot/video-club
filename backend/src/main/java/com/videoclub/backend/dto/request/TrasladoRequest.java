package com.videoclub.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrasladoRequest {

    @NotNull(message = "El consecutivo de la copia es obligatorio")
    private Integer consecutivoCopia;

    @NotNull(message = "La sucursal destino es obligatoria")
    private Integer sucursalDestino;

    @Size(max = 100, message = "Los comentarios no pueden superar 100 caracteres")
    private String comentarios;
}
