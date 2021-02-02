<?php

require_once('datos/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('datos/mensajes.php');

// Esta clase representa un controlador para los turistas
class ControladorTramites
{
    // Nombdres de la tabla y de los atributos
	const NOMBRE_TABLA = "tramites";
    const NOMBRE = "nombre";
    const ID = "id";
    const IDTAREA = "idtarea";
    const DESCRIPCION = "descripcion";

    /**
     * obtiene un usuario segun su nombre y devuelve toda la información
     */
    public function obtenerTramitesIdTarea($idtarea)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA . " WHERE ".self::IDTAREA." = ?";

            $sentencia = $pdo->prepare($comando);
            $sentencia->bindValue(1, $idtarea,PDO::PARAM_STR);
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
     * obtiene un usuario segun su nombre y devuelve toda la información
     */
    public function obtenerTramiteId($id)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA . " WHERE ".self::ID." = ?";

            $sentencia = $pdo->prepare($comando);
            $sentencia->bindValue(1, $id,PDO::PARAM_STR);
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

    public function registrarTramite($idtarea,$nombre,$descripcion)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            
            // Creo la sentencia INSERT
            $comando = "INSERT INTO ".self::NOMBRE_TABLA."(".self::IDTAREA.", ".self::NOMBRE.", ".self::DESCRIPCION.") VALUES (?,?,?)";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $idtarea,PDO::PARAM_STR);
            $sentencia->bindValue(2, $nombre,PDO::PARAM_STR);
            $sentencia->bindValue(3, $descripcion,PDO::PARAM_STR);
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

    public function eliminarTramiteId($id)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "DELETE FROM ".self::NOMBRE_TABLA." WHERE ".self::ID." = ?";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $id);
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

    public function updateTramiteId($id,$nombre,$descripcion)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "UPDATE ".self::NOMBRE_TABLA." SET ".self::NOMBRE."=?,".self::DESCRIPCION."=? WHERE ".self::ID." = ?";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $nombre);
            $sentencia->bindValue(2, $descripcion);
            $sentencia->bindValue(3, $id);
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