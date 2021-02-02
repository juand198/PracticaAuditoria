<?php

// Hago que se muestren los errores si los hay
ini_set('display_errors', 1);

require_once('utilidades/ExcepcionApi.php');
require_once('vistas/VistaJson.php');
require_once('controladores/ControladorTareas.php');
require_once('modelos/Tarea.php');

// Tipo de vista de la salida de datos.
$vista = new VistaJson();

// Con esta función nos aseguramos que cualquier excepción que ocurra se muestre adecuadamente
// en el mismo formato para evitar problemas.
set_exception_handler(function ($exception) use ($vista) 
	{
	    $cuerpo = array(
	    	array(
	        	"estado" => $exception->estado,
	        	"mensaje" => $exception->getMessage()
	    	)
	    );
	    if ($exception->getCode()) 
	    {
	        $vista->estado = $exception->getCode();
	    } 
	    else 
	    {
	        $vista->estado = 500;
	    }

	    $vista->imprimir($cuerpo);
	}
);

// Obtengo los datos pasados por POST
$id = $_REQUEST['id'];
$codigo = $_REQUEST['codigo'];
$nombre = $_REQUEST['nombre'];
$descripcion = $_REQUEST['descripcion'];
$idauditora = $_REQUEST['idauditora'];
$idusuarioasig = $_REQUEST['idusuarioasig'];
// Me creo un Usuario con los datos
$tarea = new Tarea($codigo, $nombre, $descripcion,$idauditora,$idusuarioasig);

// Me creo un controlador de Usuarios
$controladorU = new ControladorTareas();
/** 
 * Aqui deberia de haber incluido id en el constructor del modelo Tarea....
 */
$vista->imprimir($controladorU->updateTareaId($tarea,$id));