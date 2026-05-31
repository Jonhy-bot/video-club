-- LABORATORIO No 4 - Bases de Datos II
-- UCR Sede de Occidente - Video Club

CREATE DATABASE IF NOT EXISTS VIDEO_CLUB DEFAULT CHARACTER SET utf8;
USE VIDEO_CLUB;

-- TABLAS

CREATE TABLE IF NOT EXISTS CATEGORIA (
    Id      INT          NOT NULL PRIMARY KEY,
    Nombre  VARCHAR(20)  NOT NULL,
    Detalle VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS SUCURSAL (
    Numero INT         NOT NULL PRIMARY KEY,
    Nombre VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS CLIENTE (
    Cedula        CHAR(9)      NOT NULL PRIMARY KEY,
    Nombre        VARCHAR(20)  NOT NULL,
    Apellido      VARCHAR(20)  NOT NULL,
    Telefono      CHAR(8)      NOT NULL,
    Correo        VARCHAR(30),
    Direccion     VARCHAR(100) NOT NULL,
    FechaRegistro DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS VIDEOJUEGO (
    Codigo           INT         NOT NULL PRIMARY KEY,
    Nombre           VARCHAR(50) NOT NULL,
    Descripcion      TEXT        NOT NULL,
    Desarrollador    VARCHAR(30) NOT NULL,
    FechaLanzamiento DATE        NOT NULL,
    IdCategoria      INT         NOT NULL,
    CONSTRAINT VideojuegoCategoriaFK FOREIGN KEY (IdCategoria) REFERENCES CATEGORIA(Id)
);

CREATE TABLE IF NOT EXISTS COPIA (
    Consecutivo      INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CodigoVideojuego INT          NOT NULL,
    NumeroSucursal   INT          NOT NULL,
    FechaIngreso     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Disponibilidad   CHAR(1)      NOT NULL DEFAULT 'S' CHECK (Disponibilidad IN ('S','N')),
    Estado           VARCHAR(200),
    CONSTRAINT CopiaSucursalFK   FOREIGN KEY (NumeroSucursal)   REFERENCES SUCURSAL(Numero),
    CONSTRAINT CopiaVideojuegoFK FOREIGN KEY (CodigoVideojuego) REFERENCES VIDEOJUEGO(Codigo)
);

CREATE TABLE IF NOT EXISTS ALQUILER (
    Secuencia         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CedulaCliente     CHAR(9)      NOT NULL,
    ConsecutivoCopia  INT          NOT NULL,
    FechaPrestamo     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CantidadDias      INT          NOT NULL,
    FechaDevolucion   DATETIME,
    DetalleDevolucion VARCHAR(200),
    CONSTRAINT AlquilerClienteFK FOREIGN KEY (CedulaCliente)    REFERENCES CLIENTE(Cedula),
    CONSTRAINT AlquilerCopiaFK   FOREIGN KEY (ConsecutivoCopia) REFERENCES COPIA(Consecutivo)
);

CREATE TABLE IF NOT EXISTS TRASLADO (
    NumeroOperacion  INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ConsecutivoCopia INT          NOT NULL,
    FechaTraslado    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    SucursalOrigen   INT          NOT NULL,
    SucursalDestino  INT          NOT NULL,
    Comentarios      VARCHAR(100),
    CONSTRAINT TrasladoCopiaFK   FOREIGN KEY (ConsecutivoCopia) REFERENCES COPIA(Consecutivo),
    CONSTRAINT TrasladoOrigenFK  FOREIGN KEY (SucursalOrigen)   REFERENCES SUCURSAL(Numero),
    CONSTRAINT TrasladoDestinoFK FOREIGN KEY (SucursalDestino)  REFERENCES SUCURSAL(Numero)
);

-- DATOS DE PRUEBA - CATEGORIAS Y SUCURSALES
-- INSERT directo, no tienen SP según el lab

INSERT IGNORE INTO CATEGORIA (Id, Nombre, Detalle) VALUES
(1, 'Acción',     'Juegos con combate rápido y reflejos'),
(2, 'RPG',        'Juegos de rol con historia profunda'),
(3, 'Deportes',   'Simulaciones deportivas'),
(4, 'Aventura',   'Exploración y resolución de puzzles'),
(5, 'Estrategia', 'Juegos de planificación y táctica');

INSERT IGNORE INTO SUCURSAL (Numero, Nombre) VALUES
(1, 'Sucursal San José'),
(2, 'Sucursal Alajuela'),
(3, 'Sucursal Heredia'),
(4, 'Sucursal Cartago'),
(5, 'Sucursal Liberia');

-- STORED PROCEDURES

DELIMITER $$

-- MODULO CLIENTES

CREATE PROCEDURE sp_ListarClientes()
BEGIN
    SELECT Cedula, Nombre, Apellido, Telefono, Correo, Direccion, FechaRegistro
    FROM CLIENTE
    ORDER BY Apellido, Nombre;
END$$

CREATE PROCEDURE sp_InsertarCliente(
    IN p_Cedula    CHAR(9),
    IN p_Nombre    VARCHAR(20),
    IN p_Apellido  VARCHAR(20),
    IN p_Telefono  CHAR(8),
    IN p_Correo    VARCHAR(30),
    IN p_Direccion VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR: No se pudo insertar el cliente. Verifique que la cédula no esté registrada.' AS Mensaje;
    END;

    INSERT INTO CLIENTE (Cedula, Nombre, Apellido, Telefono, Correo, Direccion)
    VALUES (p_Cedula, p_Nombre, p_Apellido, p_Telefono, p_Correo, p_Direccion);

    SELECT 'Cliente creado exitosamente.' AS Mensaje;
END$$

-- MODULO VIDEOJUEGOS

CREATE PROCEDURE sp_ListarVideojuegos()
BEGIN
    SELECT v.Codigo, v.Nombre, v.Descripcion, v.Desarrollador,
           v.FechaLanzamiento, c.Nombre AS NombreCategoria
    FROM VIDEOJUEGO v
    INNER JOIN CATEGORIA c ON v.IdCategoria = c.Id
    ORDER BY v.Nombre;
END$$

CREATE PROCEDURE sp_ListarCategorias()
BEGIN
    SELECT Id, Nombre, Detalle
    FROM CATEGORIA
    ORDER BY Nombre;
END$$

CREATE PROCEDURE sp_InsertarVideojuego(
    IN p_Codigo           INT,
    IN p_Nombre           VARCHAR(50),
    IN p_Descripcion      TEXT,
    IN p_Desarrollador    VARCHAR(30),
    IN p_FechaLanzamiento DATE,
    IN p_IdCategoria      INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR: No se pudo insertar el videojuego. Verifique que el código no esté repetido.' AS Mensaje;
    END;

    INSERT INTO VIDEOJUEGO (Codigo, Nombre, Descripcion, Desarrollador, FechaLanzamiento, IdCategoria)
    VALUES (p_Codigo, p_Nombre, p_Descripcion, p_Desarrollador, p_FechaLanzamiento, p_IdCategoria);

    SELECT 'Videojuego creado exitosamente.' AS Mensaje;
END$$

CREATE PROCEDURE sp_ListarSucursales()
BEGIN
    SELECT Numero, Nombre
    FROM SUCURSAL
    ORDER BY Numero;
END$$

CREATE PROCEDURE sp_InsertarCopia(
    IN p_CodigoVideojuego INT,
    IN p_NumeroSucursal   INT,
    IN p_Estado           VARCHAR(200)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR: No se pudo insertar la copia.' AS Mensaje;
    END;

    INSERT INTO COPIA (CodigoVideojuego, NumeroSucursal, Estado)
    VALUES (p_CodigoVideojuego, p_NumeroSucursal, p_Estado);

    SELECT 'Copia ingresada exitosamente.' AS Mensaje;
END$$

CREATE PROCEDURE sp_ListarCopiasDisponiblesPorSucursal(
    IN p_NumeroSucursal INT
)
BEGIN
    SELECT cp.Consecutivo, cp.Estado, cp.Disponibilidad,
           v.Codigo AS CodigoVideojuego, v.Nombre AS NombreVideojuego
    FROM COPIA cp
    INNER JOIN VIDEOJUEGO v ON cp.CodigoVideojuego = v.Codigo
    WHERE cp.NumeroSucursal = p_NumeroSucursal
      AND cp.Disponibilidad = 'S'
    ORDER BY v.Nombre;
END$$

CREATE PROCEDURE sp_TrasladarCopia(
    IN p_ConsecutivoCopia INT,
    IN p_SucursalDestino  INT,
    IN p_Comentarios      VARCHAR(100)
)
BEGIN
    DECLARE v_SucursalOrigen INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR: No se pudo realizar el traslado.' AS Mensaje;
    END;

    START TRANSACTION;

        SELECT NumeroSucursal INTO v_SucursalOrigen
        FROM COPIA
        WHERE Consecutivo = p_ConsecutivoCopia
        FOR UPDATE;

        UPDATE COPIA
        SET NumeroSucursal = p_SucursalDestino
        WHERE Consecutivo = p_ConsecutivoCopia;

        INSERT INTO TRASLADO (ConsecutivoCopia, SucursalOrigen, SucursalDestino, Comentarios)
        VALUES (p_ConsecutivoCopia, v_SucursalOrigen, p_SucursalDestino, p_Comentarios);

    COMMIT;

    SELECT 'Traslado realizado exitosamente.' AS Mensaje;
END$$

-- MODULO ALQUILERES

CREATE PROCEDURE sp_ObtenerClientePorCedula(
    IN p_Cedula CHAR(9)
)
BEGIN
    SELECT Cedula, Nombre, Apellido, Telefono, Correo, Direccion, FechaRegistro
    FROM CLIENTE
    WHERE Cedula = p_Cedula;
END$$

CREATE PROCEDURE sp_ListarVideojuegosDisponiblesPorSucursal(
    IN p_NumeroSucursal INT
)
BEGIN
    SELECT DISTINCT v.Codigo, v.Nombre, v.Desarrollador, c.Nombre AS NombreCategoria
    FROM VIDEOJUEGO v
    INNER JOIN COPIA     cp ON v.Codigo      = cp.CodigoVideojuego
    INNER JOIN CATEGORIA c  ON v.IdCategoria = c.Id
    WHERE cp.NumeroSucursal = p_NumeroSucursal
      AND cp.Disponibilidad = 'S'
    ORDER BY v.Nombre;
END$$

CREATE PROCEDURE sp_InsertarAlquiler(
    IN p_CedulaCliente  CHAR(9),
    IN p_CodigoJuego    INT,
    IN p_NumeroSucursal INT,
    IN p_CantidadDias   INT
)
BEGIN
    DECLARE v_ConsecutivoCopia INT;
    DECLARE v_Secuencia        INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR: No se pudo registrar el alquiler.' AS Mensaje;
    END;

    START TRANSACTION;

        SELECT Consecutivo INTO v_ConsecutivoCopia
        FROM COPIA
        WHERE CodigoVideojuego = p_CodigoJuego
          AND NumeroSucursal   = p_NumeroSucursal
          AND Disponibilidad   = 'S'
        LIMIT 1
        FOR UPDATE;

        IF v_ConsecutivoCopia IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No hay copias disponibles para ese videojuego en esa sucursal.';
        END IF;

        UPDATE COPIA
        SET Disponibilidad = 'N'
        WHERE Consecutivo = v_ConsecutivoCopia;

        INSERT INTO ALQUILER (CedulaCliente, ConsecutivoCopia, CantidadDias)
        VALUES (p_CedulaCliente, v_ConsecutivoCopia, p_CantidadDias);

        SET v_Secuencia = LAST_INSERT_ID();

    COMMIT;

    SELECT v_Secuencia AS SecuenciaAlquiler, 'Alquiler registrado exitosamente.' AS Mensaje;
END$$

CREATE PROCEDURE sp_ListarAlquileresActivosPorCliente(
    IN p_CedulaCliente CHAR(9)
)
BEGIN
    SELECT a.Secuencia, a.FechaPrestamo, a.CantidadDias,
           v.Codigo AS CodigoVideojuego, v.Nombre AS NombreVideojuego,
           cp.Consecutivo AS ConsecutivoCopia,
           s.Numero AS NumeroSucursal, s.Nombre AS NombreSucursal
    FROM ALQUILER a
    INNER JOIN COPIA      cp ON a.ConsecutivoCopia  = cp.Consecutivo
    INNER JOIN VIDEOJUEGO v  ON cp.CodigoVideojuego = v.Codigo
    INNER JOIN SUCURSAL   s  ON cp.NumeroSucursal   = s.Numero
    WHERE a.CedulaCliente    = p_CedulaCliente
      AND a.FechaDevolucion IS NULL
    ORDER BY a.FechaPrestamo DESC;
END$$

CREATE PROCEDURE sp_RegresarVideojuego(
    IN p_Secuencia INT,
    IN p_Detalle   VARCHAR(200)
)
BEGIN
    DECLARE v_ConsecutivoCopia INT;
    DECLARE v_FechaPrestamo    DATETIME;
    DECLARE v_CantidadDias     INT;
    DECLARE v_DiasAtrasado     INT;
    DECLARE v_DetalleReal      VARCHAR(200);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR: No se pudo registrar la devolución.' AS Mensaje;
    END;

    START TRANSACTION;

        SELECT ConsecutivoCopia, FechaPrestamo, CantidadDias
        INTO v_ConsecutivoCopia, v_FechaPrestamo, v_CantidadDias
        FROM ALQUILER
        WHERE Secuencia = p_Secuencia
        FOR UPDATE;

        SET v_DiasAtrasado = DATEDIFF(NOW(), DATE_ADD(v_FechaPrestamo, INTERVAL v_CantidadDias DAY));

        IF v_DiasAtrasado > 0 THEN
            SET v_DetalleReal = CONCAT('Devuelto con ', v_DiasAtrasado, ' día(s) de atraso. ', IFNULL(p_Detalle, ''));
        ELSE
            SET v_DetalleReal = p_Detalle;
        END IF;

        UPDATE ALQUILER
        SET FechaDevolucion   = NOW(),
            DetalleDevolucion = v_DetalleReal
        WHERE Secuencia = p_Secuencia;

        UPDATE COPIA
        SET Disponibilidad = 'S'
        WHERE Consecutivo = v_ConsecutivoCopia;

    COMMIT;

    SELECT 'Devolución registrada exitosamente.' AS Mensaje;
END$$

CREATE PROCEDURE sp_ListarHistorialAlquileresPorCliente(
    IN p_CedulaCliente CHAR(9)
)
BEGIN
    SELECT a.Secuencia, a.FechaPrestamo, a.CantidadDias, a.FechaDevolucion,
           a.DetalleDevolucion,
           v.Codigo AS CodigoVideojuego, v.Nombre AS NombreVideojuego,
           cp.Consecutivo AS ConsecutivoCopia
    FROM ALQUILER a
    INNER JOIN COPIA      cp ON a.ConsecutivoCopia  = cp.Consecutivo
    INNER JOIN VIDEOJUEGO v  ON cp.CodigoVideojuego = v.Codigo
    WHERE a.CedulaCliente = p_CedulaCliente
    ORDER BY a.FechaPrestamo DESC;
END$$

DELIMITER ;

-- DATOS DE PRUEBA - CLIENTES, VIDEOJUEGOS Y COPIAS
-- Se llaman los procedimientos creados

CALL sp_InsertarCliente('101110001', 'Juan',   'Pérez',     '22221111', 'juan@mail.com',  'San José Centro');
CALL sp_InsertarCliente('202220002', 'María',  'González',  '33332222', 'maria@mail.com', 'Alajuela Centro');
CALL sp_InsertarCliente('303330003', 'Carlos', 'Rodríguez', '44443333', NULL,             'Heredia Norte');
CALL sp_InsertarCliente('404440004', 'Ana',    'Jiménez',   '55554444', 'ana@mail.com',   'Cartago Centro');
CALL sp_InsertarCliente('505550005', 'Luis',   'Mora',      '66665555', 'luis@mail.com',  'Liberia Centro');

CALL sp_InsertarVideojuego(1,  'The Legend of Zelda', 'Aventura épica en Hyrule',           'Nintendo',     '2017-03-03', 4);
CALL sp_InsertarVideojuego(2,  'FIFA 24',             'Simulación de fútbol mundial',        'EA Sports',    '2023-09-29', 3);
CALL sp_InsertarVideojuego(3,  'God of War',          'Acción mitológica nórdica',           'Santa Monica', '2018-04-20', 1);
CALL sp_InsertarVideojuego(4,  'Final Fantasy XVI',   'RPG de fantasía épica',               'Square Enix',  '2023-06-22', 2);
CALL sp_InsertarVideojuego(5,  'Age of Empires IV',   'Estrategia histórica en tiempo real', 'Relic',        '2021-10-28', 5);
CALL sp_InsertarVideojuego(6,  'Spider-Man 2',        'Acción de superhéroes en NY',         'Insomniac',    '2023-10-20', 1);
CALL sp_InsertarVideojuego(7,  'Elden Ring',          'RPG de mundo abierto oscuro',         'FromSoftware', '2022-02-25', 2);
CALL sp_InsertarVideojuego(8,  'NBA 2K24',            'Simulación de baloncesto',            '2K Sports',    '2023-09-08', 3);
CALL sp_InsertarVideojuego(9,  'Minecraft',           'Construcción y supervivencia',        'Mojang',       '2011-11-18', 4);
CALL sp_InsertarVideojuego(10, 'StarCraft II',        'Estrategia espacial competitiva',     'Blizzard',     '2010-07-27', 5);

-- Al menos 3 videojuegos con 3 copias en distintas sucursales
CALL sp_InsertarCopia(1, 1, 'Buen estado');
CALL sp_InsertarCopia(1, 2, 'Buen estado');
CALL sp_InsertarCopia(1, 3, 'Rayado leve');

CALL sp_InsertarCopia(2, 1, 'Buen estado');
CALL sp_InsertarCopia(2, 2, 'Buen estado');
CALL sp_InsertarCopia(2, 4, 'Caja dañada');

CALL sp_InsertarCopia(3, 1, 'Buen estado');
CALL sp_InsertarCopia(3, 3, 'Buen estado');
CALL sp_InsertarCopia(3, 5, 'Buen estado');

CALL sp_InsertarCopia(4, 2, 'Buen estado');
CALL sp_InsertarCopia(4, 4, 'Buen estado');
CALL sp_InsertarCopia(5, 1, 'Buen estado');
CALL sp_InsertarCopia(5, 5, 'Rayado leve');
CALL sp_InsertarCopia(6, 2, 'Buen estado');
CALL sp_InsertarCopia(6, 3, 'Buen estado');
CALL sp_InsertarCopia(7, 4, 'Buen estado');
CALL sp_InsertarCopia(7, 1, 'Buen estado');
CALL sp_InsertarCopia(8, 5, 'Buen estado');
CALL sp_InsertarCopia(9, 2, 'Buen estado');
CALL sp_InsertarCopia(10, 3, 'Buen estado');

-- USUARIO CON PERMISO SOLO PARA EJECUTAR SPs

CREATE USER IF NOT EXISTS 'videoclub_user'@'%' IDENTIFIED BY 'videoclub1234';
GRANT EXECUTE ON VIDEO_CLUB.* TO 'videoclub_user'@'%';
FLUSH PRIVILEGES;
