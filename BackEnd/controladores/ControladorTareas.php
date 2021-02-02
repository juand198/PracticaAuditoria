<?php

require_once('datos/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('datos/mensajes.php');

// Esta clase representa un controlador para los turistas
class ControladorTareas
{
    // Nombdres de la tabla y de los atributos
	const NOMBRE_TABLA = "tareas";
    const NOMBRE = "nombre";
    const ID = "id";
    const CODIGO = "codigo";
    const IDAUDITORA = "idauditora";
    const DESCRIPCION = "descripcion";
    const IDUSUARIOASIG = "idusuarioasig";

    /**
	 * Descripción: Inserta una turista en la base de datos
	 * @param turista turista para insertar en la base de datos
	 * @return Indica si se ha insertado la usuario correctamente (Código 1)
	 */
    public function registrarTarea($tarea)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            
            // Creo la sentencia INSERT
            $comando = "INSERT INTO ".self::NOMBRE_TABLA."(".self::NOMBRE.", ".self::CODIGO.", ".self::IDAUDITORA.", ". self::DESCRIPCION .", ".self::IDUSUARIOASIG.") VALUES (?,?,?,?,?)";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $tarea->getNombre(),PDO::PARAM_STR);
            $sentencia->bindValue(2, $tarea->getCodigo(),PDO::PARAM_STR);
            $sentencia->bindValue(3, $tarea->getIdauditora(),PDO::PARAM_STR);
            $sentencia->bindValue(4, $tarea->getDescripcion(),PDO::PARAM_STR);
            $sentencia->bindValue(5, $tarea->getIdusuarioasig(),PDO::PARAM_STR);
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
    
    public function obtenerTodasTareas()
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA ;

            $sentencia = $pdo->prepare($comando);
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
    public function obtenerTareasAuditora($idauditora)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA ." WHERE ".self::IDAUDITORA."= ?";
            $sentencia = $pdo->prepare($comando);
            $sentencia->bindValue(1, $idauditora,PDO::PARAM_STR);
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

    public function eliminarTareaId($id)
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

    public function updateTareaId($tarea,$id)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "UPDATE ".self::NOMBRE_TABLA." SET ".self::CODIGO."=?,".self::NOMBRE."=?,".self::DESCRIPCION."=?,".self::IDAUDITORA."=?,".self::IDUSUARIOASIG."=? WHERE ".self::ID." = ?";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $tarea->getCodigo());
            $sentencia->bindValue(2, $tarea->getNombre());
            $sentencia->bindValue(3, $tarea->getDescripcion());
            $sentencia->bindValue(4, $tarea->getIdauditora());
            $sentencia->bindValue(5, $tarea->getIdusuarioasig());            
            $sentencia->bindValue(6, $id);
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