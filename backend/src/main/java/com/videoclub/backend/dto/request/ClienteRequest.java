package com.videoclub.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClienteRequest {

    @NotBlank(message = "La cédula es obligatoria")
    @Size(min = 9, max = 9, message = "La cédula debe tener exactamente 9 caracteres")
    private String cedula;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 20, message = "El nombre no puede superar 20 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 20, message = "El apellido no puede superar 20 caracteres")
    private String apellido;

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(min = 8, max = 8, message = "El teléfono debe tener exactamente 8 caracteres")
    private String telefono;

    @Email(message = "El correo no tiene un formato válido")
    @Size(max = 30, message = "El correo no puede superar 30 caracteres")
    private String correo;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 100, message = "La dirección no puede superar 100 caracteres")
    private String direccion;
}
