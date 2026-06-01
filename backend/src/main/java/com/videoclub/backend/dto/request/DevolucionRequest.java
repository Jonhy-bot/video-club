package com.videoclub.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DevolucionRequest {

    @NotNull(message = "La secuencia del alquiler es obligatoria")
    private Integer secuencia;

    @Size(max = 200, message = "El detalle no puede superar 200 caracteres")
    private String detalle;
}
