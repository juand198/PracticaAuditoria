<?php

require_once('datos/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('datos/mensajes.php');

// Esta clase representa un controlador para los turistas
class ControladorAuditadas{
    // Nombdres de la tabla y de los atributos
	const NOMBRE_TABLA = "auditada";
    const NOMBRE = "nombre";
    const ID = "id";
    const IDAUDITORA = "idauditora";

    /**
     * obtiene un usuario segun su nombre y devuelve toda la información
     */
    public function obtenerEmpresasAuditadasAuditora($idauditora)
    {
        try 
        {
            // Obtengo una instancia de la base de datos ya conectada
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Creo la sentencia INSERT
            $comando = "SELECT * FROM ".self::NOMBRE_TABLA . " WHERE " . self::IDAUDITORA . " = ?";
            
            $sentencia = $pdo->prepare($comando);
            
            $sentencia->bindParam(1,$idauditora);
		    $sentencia->execute();



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

}