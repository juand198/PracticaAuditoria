<?php

require_once('datos/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('datos/mensajes.php');

// Esta clase representa un controlador para los turistas
class ControladorDocumentos
{
    // Nombdres de la tabla y de los atributos
	const NOMBRE_TABLA = "documentos";
    const IDTRAMITE = "idtramite";
    const ID = "id";
    const RUTA = "ruta";
    const NOMBRE ="nombre";
    const DESCRIPCION = "descripcion";

    /**
	 * Descripción: Inserta una turista en la base de datos
	 * @param turista turista para insertar en la base de datos
	 * @return Indica si se ha insertado la usuario correctamente (Código 1)
	 */
    public function registrarDocumento($idtramite,$ruta,$nombre,$descripcion)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            
            // Creo la sentencia INSERT
            $comando = "INSERT INTO ".self::NOMBRE_TABLA."(".self::IDTRAMITE.", ".self::RUTA.", ". self::NOMBRE.", ".self::DESCRIPCION.") VALUES (?,?,?,?)";

            $sentencia = $pdo->prepare($comando);
            // Pongo los datos en la consulta INSERT
            $sentencia->bindValue(1, $idtramite,PDO::PARAM_STR);
            $sentencia->bindValue(2, $ruta,PDO::PARAM_STR);
            $sentencia->bindValue(3, $nombre,PDO::PARAM_STR);
            $sentencia->bindValue(4, $descripcion,PDO::PARAM_STR);
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

    public function obtenerDocumentosIdTramite($idtramite){
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA . " WHERE ".self::IDTRAMITE." = ?";

            $sentencia = $pdo->prepare($comando);
            $sentencia->bindValue(1, $idtramite,PDO::PARAM_STR);
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
    public function obtenerDocumentosId($id){
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

    public function eliminarDocumentoId($id)
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

}