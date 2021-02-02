<?php

// Hago que se muestren los errores si los hay
ini_set('display_errors', 1);

require_once('utilidades/ExcepcionApi.php');
require_once('vistas/VistaJson.php');
require_once('controladores/ControladorUsuarios.php');
require_once('modelos/Usuarios.php');

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
$nombre = $_REQUEST['nombre'];
$pass = $_REQUEST['pass'];
$categoria = $_REQUEST['categoria'];
$idauditora = $_REQUEST['idauditora'];
// Me creo un Usuario con los datos
$usuario = new Usuarios($nombre, $pass, $categoria,$idauditora);

// Me creo un controlador de Usuarios
$controladorU = new ControladorUsuarios();

// Saco por pantalla en formato JSON el resultado
$vista->imprimir($controladorU->registrarUsuario($usuario));