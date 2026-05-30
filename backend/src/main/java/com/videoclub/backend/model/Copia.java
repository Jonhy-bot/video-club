package com.videoclub.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Copia {
    // campos que retorna sp_ListarCopiasDisponiblesPorSucursal
    private Integer consecutivo;
    private String estado;
    private String disponibilidad;
    private Integer codigoVideojuego;
    private String nombreVideojuego;
    // para sp_InsertarCopia
    private Integer numeroSucursal;
    // para sp_TrasladarCopia
    private Integer sucursalDestino;
    private String comentarios;
}
