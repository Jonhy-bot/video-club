package com.videoclub.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VideojuegoRequest {

    @NotNull(message = "El código es obligatorio")
    private Integer codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar 50 caracteres")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotBlank(message = "El desarrollador es obligatorio")
    @Size(max = 30, message = "El desarrollador no puede superar 30 caracteres")
    private String desarrollador;

    @NotNull(message = "La fecha de lanzamiento es obligatoria")
    private LocalDate fechaLanzamiento;

    @NotNull(message = "La categoría es obligatoria")
    private Integer idCategoria;
}
