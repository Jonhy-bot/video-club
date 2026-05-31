package com.videoclub.backend.repository;

import com.videoclub.backend.model.*;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.ColumnMapRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Types;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@SuppressWarnings("unchecked")
@Repository
public class VideoClubRepository {

    private final JdbcTemplate jdbcTemplate;

    public VideoClubRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private String extractMensaje(Map<String, Object> out, String key) {
        List<Map<String, Object>> rows = (List<Map<String, Object>>) out.get(key);
        return (String) rows.get(0).get("Mensaje");
    }

    // ---- CLIENTES ----

    public List<Cliente> listarClientes() {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarClientes")
            .returningResultSet("clientes", new BeanPropertyRowMapper<>(Cliente.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource());
        return (List<Cliente>) out.get("clientes");
    }

    public String insertarCliente(String cedula, String nombre, String apellido,
                                   String telefono, String correo, String direccion) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_InsertarCliente")
            .declareParameters(
                new SqlParameter("p_Cedula",    Types.CHAR),
                new SqlParameter("p_Nombre",    Types.VARCHAR),
                new SqlParameter("p_Apellido",  Types.VARCHAR),
                new SqlParameter("p_Telefono",  Types.CHAR),
                new SqlParameter("p_Correo",    Types.VARCHAR),
                new SqlParameter("p_Direccion", Types.VARCHAR)
            )
            .returningResultSet("resultado", new ColumnMapRowMapper());
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("p_Cedula",    cedula)
            .addValue("p_Nombre",    nombre)
            .addValue("p_Apellido",  apellido)
            .addValue("p_Telefono",  telefono)
            .addValue("p_Correo",    correo)
            .addValue("p_Direccion", direccion);
        return extractMensaje(call.execute(params), "resultado");
    }

    public Optional<Cliente> obtenerClientePorCedula(String cedula) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ObtenerClientePorCedula")
            .declareParameters(new SqlParameter("p_Cedula", Types.CHAR))
            .returningResultSet("cliente", new BeanPropertyRowMapper<>(Cliente.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource("p_Cedula", cedula));
        List<Cliente> rows = (List<Cliente>) out.get("cliente");
        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    // ---- CATEGORIAS ----

    public List<Categoria> listarCategorias() {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarCategorias")
            .returningResultSet("categorias", new BeanPropertyRowMapper<>(Categoria.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource());
        return (List<Categoria>) out.get("categorias");
    }

    // ---- SUCURSALES ----

    public List<Sucursal> listarSucursales() {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarSucursales")
            .returningResultSet("sucursales", new BeanPropertyRowMapper<>(Sucursal.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource());
        return (List<Sucursal>) out.get("sucursales");
    }

    // ---- VIDEOJUEGOS ----

    public List<Videojuego> listarVideojuegos() {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarVideojuegos")
            .returningResultSet("videojuegos", new BeanPropertyRowMapper<>(Videojuego.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource());
        return (List<Videojuego>) out.get("videojuegos");
    }

    public String insertarVideojuego(Integer codigo, String nombre, String descripcion,
                                      String desarrollador, LocalDate fechaLanzamiento,
                                      Integer idCategoria) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_InsertarVideojuego")
            .declareParameters(
                new SqlParameter("p_Codigo",           Types.INTEGER),
                new SqlParameter("p_Nombre",           Types.VARCHAR),
                new SqlParameter("p_Descripcion",      Types.LONGVARCHAR),
                new SqlParameter("p_Desarrollador",    Types.VARCHAR),
                new SqlParameter("p_FechaLanzamiento", Types.DATE),
                new SqlParameter("p_IdCategoria",      Types.INTEGER)
            )
            .returningResultSet("resultado", new ColumnMapRowMapper());
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("p_Codigo",           codigo)
            .addValue("p_Nombre",           nombre)
            .addValue("p_Descripcion",      descripcion)
            .addValue("p_Desarrollador",    desarrollador)
            .addValue("p_FechaLanzamiento", Date.valueOf(fechaLanzamiento))
            .addValue("p_IdCategoria",      idCategoria);
        return extractMensaje(call.execute(params), "resultado");
    }

    public List<Videojuego> listarVideojuegosDisponiblesPorSucursal(Integer numeroSucursal) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarVideojuegosDisponiblesPorSucursal")
            .declareParameters(new SqlParameter("p_NumeroSucursal", Types.INTEGER))
            .returningResultSet("videojuegos", new BeanPropertyRowMapper<>(Videojuego.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource("p_NumeroSucursal", numeroSucursal));
        return (List<Videojuego>) out.get("videojuegos");
    }

    // ---- COPIAS ----

    public String insertarCopia(Integer codigoVideojuego, Integer numeroSucursal, String estado) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_InsertarCopia")
            .declareParameters(
                new SqlParameter("p_CodigoVideojuego", Types.INTEGER),
                new SqlParameter("p_NumeroSucursal",   Types.INTEGER),
                new SqlParameter("p_Estado",           Types.VARCHAR)
            )
            .returningResultSet("resultado", new ColumnMapRowMapper());
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("p_CodigoVideojuego", codigoVideojuego)
            .addValue("p_NumeroSucursal",   numeroSucursal)
            .addValue("p_Estado",           estado);
        return extractMensaje(call.execute(params), "resultado");
    }

    public List<Copia> listarCopiasDisponiblesPorSucursal(Integer numeroSucursal) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarCopiasDisponiblesPorSucursal")
            .declareParameters(new SqlParameter("p_NumeroSucursal", Types.INTEGER))
            .returningResultSet("copias", new BeanPropertyRowMapper<>(Copia.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource("p_NumeroSucursal", numeroSucursal));
        return (List<Copia>) out.get("copias");
    }

    public String trasladarCopia(Integer consecutivoCopia, Integer sucursalDestino, String comentarios) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_TrasladarCopia")
            .declareParameters(
                new SqlParameter("p_ConsecutivoCopia", Types.INTEGER),
                new SqlParameter("p_SucursalDestino",  Types.INTEGER),
                new SqlParameter("p_Comentarios",      Types.VARCHAR)
            )
            .returningResultSet("resultado", new ColumnMapRowMapper());
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("p_ConsecutivoCopia", consecutivoCopia)
            .addValue("p_SucursalDestino",  sucursalDestino)
            .addValue("p_Comentarios",      comentarios);
        return extractMensaje(call.execute(params), "resultado");
    }

    // ---- ALQUILERES ----

    public Map<String, Object> insertarAlquiler(String cedulaCliente, Integer codigoJuego,
                                                  Integer numeroSucursal, Integer cantidadDias) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_InsertarAlquiler")
            .declareParameters(
                new SqlParameter("p_CedulaCliente",  Types.CHAR),
                new SqlParameter("p_CodigoJuego",    Types.INTEGER),
                new SqlParameter("p_NumeroSucursal", Types.INTEGER),
                new SqlParameter("p_CantidadDias",   Types.INTEGER)
            )
            .returningResultSet("resultado", new ColumnMapRowMapper());
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("p_CedulaCliente",  cedulaCliente)
            .addValue("p_CodigoJuego",    codigoJuego)
            .addValue("p_NumeroSucursal", numeroSucursal)
            .addValue("p_CantidadDias",   cantidadDias);
        Map<String, Object> out = call.execute(params);
        List<Map<String, Object>> rows = (List<Map<String, Object>>) out.get("resultado");
        return rows.get(0);
    }

    public List<Alquiler> listarAlquileresActivosPorCliente(String cedulaCliente) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarAlquileresActivosPorCliente")
            .declareParameters(new SqlParameter("p_CedulaCliente", Types.CHAR))
            .returningResultSet("alquileres", new BeanPropertyRowMapper<>(Alquiler.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource("p_CedulaCliente", cedulaCliente));
        return (List<Alquiler>) out.get("alquileres");
    }

    public String regresarVideojuego(Integer secuencia, String detalle) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_RegresarVideojuego")
            .declareParameters(
                new SqlParameter("p_Secuencia", Types.INTEGER),
                new SqlParameter("p_Detalle",   Types.VARCHAR)
            )
            .returningResultSet("resultado", new ColumnMapRowMapper());
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("p_Secuencia", secuencia)
            .addValue("p_Detalle",   detalle);
        return extractMensaje(call.execute(params), "resultado");
    }

    public List<Alquiler> listarHistorialAlquileresPorCliente(String cedulaCliente) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
            .withoutProcedureColumnMetaDataAccess()
            .withProcedureName("sp_ListarHistorialAlquileresPorCliente")
            .declareParameters(new SqlParameter("p_CedulaCliente", Types.CHAR))
            .returningResultSet("alquileres", new BeanPropertyRowMapper<>(Alquiler.class));
        Map<String, Object> out = call.execute(new MapSqlParameterSource("p_CedulaCliente", cedulaCliente));
        return (List<Alquiler>) out.get("alquileres");
    }
}
