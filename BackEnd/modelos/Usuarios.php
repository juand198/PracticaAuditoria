<?php

// Esta clase representa un Usuario

class Usuarios
{
    // Variables de clase
    private $nombre, $pass,$categoria,$idauditora,$edicion,$insercion,$visualizacion;

    // Constructor
    public function __construct($nombre, $pass,$categoria,$idauditora,$edicion=1,$insercion=1,$visualizacion=1)
    {
        $this->nombre = $nombre;
        $this->pass = $pass;
        $this->categoria = $categoria;
        $this->idauditora = $idauditora;
        $this->insercion = $insercion;
        $this->edicion = $edicion;
        $this->visualizacion = $visualizacion;
    }

    public function getIdAuditora(){
        return $this->idauditora;
    }

    public function getNombre(){
        return $this->nombre;
    }

    public function getPass(){
        return $this->pass;
    }
    
    public function getCategoria(){
        return $this->categoria;
    }

    public function getInsercion(){
        return $this->insercion;
    }
    public function setInsercion($insercion){
        $this->insercion = $insercion;
    }

    public function getEdicion(){
        return $this->edicion;
    }
    public function setEdicion($edicion){
        $this->edicion = $edicion;
    }

    public function getVisualizacion(){
        return $this->visualizacion;
    }
    public function setVisualizacion($visualizacion){
        $this->visualizacion = $visualizacion;
    }

}