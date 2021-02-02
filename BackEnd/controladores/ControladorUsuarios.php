<?php

require_once('datos/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('datos/mensajes.php');

// Esta clase representa un controlador para los turistas
class ControladorUsuarios
{
    // Nombdres de la tabla y de los atributos
	const NOMBRE_TABLA = "usuarios";
    const NOMBRE = "nombre";
    const CATEGORIA = "categoria";
    const PASS = "pass";
    const IDAUDITORA = "idauditora";
    const INSERCION = "insercion";
    const EDICION = "edicion";
    const VISUALIZACION = "visualizacion";

    /**
	 * Descripción: Inserta una turista en la base de datos
	 * @param turista turista para insertar en la base de datos
	 * @return Indica si se ha insertado la usuario correctamente (Código 1)
	 */
    public function registrarUsuario($usuario)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            
            // Creo la sentencia INSERT
            $comando = "INSERT INTO ".self::NOMBRE_TABLA."(".self::NOMBRE.", ".self::PASS.", ".self::CATEGORIA.", ". self::IDAUDITORA .", ".self::INSERCION.", ".self::VISUALIZACION.", ".self::EDICION.") VALUES (?,?,?,(SELECT id FROM auditora WHERE nombre=?),?,?,?)";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $usuario->getNombre(),PDO::PARAM_STR);
            $sentencia->bindValue(2, $usuario->getPass(),PDO::PARAM_STR);
            $sentencia->bindValue(3, $usuario->getCategoria(),PDO::PARAM_STR);
            $sentencia->bindValue(4, $usuario->getIdAuditora(),PDO::PARAM_STR);
            $sentencia->bindValue(5, $usuario->getInsercion(),PDO::PARAM_STR);
            $sentencia->bindValue(6, $usuario->getVisualizacion(),PDO::PARAM_STR);
            $sentencia->bindValue(7, $usuario->getEdicion(),PDO::PARAM_STR);
            // Ejecuto la consulta
            $resultado = $sentencia->execute();
        } 
        catch (PDOException $e) 
        {
            throw new ExcepcionApi(ESTADO_ERROR_BD, $e->getMessage());
        }

        switch ($resultado)
        {
            case ESTADO_CREACION_EXITOSA:
                http_response_code(200);
                return correcto;
                break;
            case ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(ESTADO_CREACION_FALLIDA, "Ha ocurrido un error.");
                break;
            default:
                throw new ExcepcionApi(ESTADO_FALLA_DESCONOCIDA, "Fallo desconocido.", 400);
        }
    }

    /**
     * obtiene un usuario segun su nombre y devuelve toda la información
     */
    public function obtenerUsuario($nombre)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA." WHERE ".self::NOMBRE." = ?";

            $sentencia = $pdo->prepare($comando);

            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $nombre);

            // Ejecuto la consulta
            $resultado = $sentencia->execute();

            $array = array();

		    while ($row = $sentencia->fetch(PDO::FETCH_ASSOC)) 
		    { 
				array_push($array, $row);
			}

			return [
            	[
               	 	"estado" => ESTADO_CREACION_EXITOSA,
                	"mensaje" => $array
                ]
            ];

        } 
        catch (PDOException $e) 
        {
            throw new ExcepcionApi(ESTADO_ERROR_BD, $e->getMessage());
        }
    }

    /**
     * Descripción: updatea un turista de la base de datos
     * @param turista turista para insertar en la base de datos
     * @return Indica si se ha insertado la usuario correctamente (Código 1)
     */
    public function UpdateUsuario($usuario)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "UPDATE ".self::NOMBRE_TABLA." 
                        SET ".self::NOMBRE."=?,
                            ".self::APELLIDOS."=?,
                            ".self::EMAIL."=?,
                            ".self::TIPO."=?,
                            ".self::PRIMERAVEZ."=?,
                            ".self::CIUDAD."=?,
                            ".self::PROVINCIA."=?,
                            ".self::URLFOTO."=? 
                        WHERE ".self::EMAIL."=?";
            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $usuario->getNombre(),PDO::PARAM_STR);
            $sentencia->bindValue(2, $usuario->getApellidos(),PDO::PARAM_STR);
            $sentencia->bindValue(3, $usuario->getEmail(),PDO::PARAM_STR);
            $sentencia->bindValue(4, $usuario->getTipo(),PDO::PARAM_STR);
            $sentencia->bindValue(5, $usuario->getPrimeraVez(),PDO::PARAM_STR);
            $sentencia->bindValue(6, $usuario->getCiudad(),PDO::PARAM_STR);
            $sentencia->bindValue(7, $usuario->getProvincia(),PDO::PARAM_STR);
            $sentencia->bindValue(8, $usuario->getUrlfoto(),PDO::PARAM_STR);
            $sentencia->bindValue(9, $usuario->getEmail(),PDO::PARAM_STR);

            // Ejecuto la consulta
            $resultado = $sentencia->execute();
        } 
        catch (PDOException $e) 
        {
            throw new ExcepcionApi(ESTADO_ERROR_BD, $e->getMessage());
        }

        switch ($resultado) 
        {
            case ESTADO_CREACION_EXITOSA:
                http_response_code(200);
                return correcto;
                break;
            case ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(ESTADO_CREACION_FALLIDA, "Ha ocurrido un error.");
                break;
            default:
                throw new ExcepcionApi(ESTADO_FALLA_DESCONOCIDA, "Fallo desconocido.", 400);
        }
    }
    public function ObtenerUsuarioIdAuditora($idauditora)
    {
		try 
		{
		    $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

		    // Sentencia SELECT
		    $comando = $comando = "SELECT * FROM ".self::NOMBRE_TABLA." WHERE ".self::IDAUDITORA." = ?";
		    $sentencia = $pdo->prepare($comando);

	    	$sentencia->bindParam(1,$idauditora);
		    $sentencia->execute();

		    $array = array();

		    while ($row = $sentencia->fetch(PDO::FETCH_ASSOC)) 
		    { 
				array_push($array, $row);
			}

			return [
            	[
               	 	"estado" => ESTADO_CREACION_EXITOSA,
                	"mensaje" => $array
                ]
            ];
		} 
		catch (PDOException $e) 
		{
		    throw new ExcepcionApi(ESTADO_ERROR_BD, $e->getMessage());
		}
    }

    /**
     * Descripcion obtiene un turista en funcion de su id
     * @param token  id del turista a buscar
     * @return JSON que indica si se ha insertado la usuario correctamente (Código 1)
     */
    public function obtenerUsuarioClub($club)
    {
		try 
		{
		    $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

		    // Sentencia SELECT
		    $comando = "SELECT u.* FROM clubusuario cu INNER JOIN ".self::NOMBRE_TABLA." u on u.id = cu.idusuario INNER JOIN clubes c on cu.idclub = c.id WHERE c.id = ?";
		    $sentencia = $pdo->prepare($comando);

	    	$sentencia->bindParam(1,$club);
		    $sentencia->execute();

		    $array = array();

		    while ($row = $sentencia->fetch(PDO::FETCH_ASSOC)) 
		    { 
				array_push($array, $row);
			}

			return [
            	[
               	 	"estado" => ESTADO_CREACION_EXITOSA,
                	"mensaje" => $array
                ]
            ];
		} 
		catch (PDOException $e) 
		{
		    throw new ExcepcionApi(ESTADO_ERROR_BD, $e->getMessage());
		}
    }

    public function agregarUsuarioClub($email,$club)
    {
		try 
		{
		    $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

		    // Sentencia SELECT
		    $comando = "INSERT INTO clubusuario(idclub, idusuario) VALUES (?,(SELECT id from ".self::NOMBRE_TABLA." where email = ?))";
		    $sentencia = $pdo->prepare($comando);

	    	$sentencia->bindParam(1,$club);
	    	$sentencia->bindParam(2,$email);

		    // Ejecuto la consulta
            $resultado = $sentencia->execute();
        } 
        catch (PDOException $e) 
        {
            throw new ExcepcionApi(ESTADO_ERROR_BD, $e->getMessage());
        }

        switch ($resultado) 
        {
            case ESTADO_CREACION_EXITOSA:
                http_response_code(200);
                return correcto;
                break;
            case ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(ESTADO_CREACION_FALLIDA, "Ha ocurrido un error.");
                break;
            default:
                throw new ExcepcionApi(ESTADO_FALLA_DESCONOCIDA, "Fallo desconocido.", 400);
        }
    }

}