<?php

// Esta clase representa un Usuario

class Tarea
{
    // Variables de clase
    private $id, $codigo,$nombre,$descripcion,$idauditora,$idusuarioasig;

    // Constructor
    public function __construct($codigo,$nombre,$descripcion,$idauditora,$idusuarioasig)
    {
        $this->codigo = $codigo;
        $this->nombre = $nombre;
        $this->idauditora = $idauditora;
        $this->descripcion = $descripcion;
        $this->idusuarioasig = $idusuarioasig;
    }

    public function getnombre(){
        return $this->nombre;
    }

    public function getid(){
        return $this->id;
    }

    public function getCodigo(){
        return $this->codigo;
    }

    public function getIdauditora(){
        return $this->idauditora;
    }
    public function setIdauditora($idauditora){
        $this->idauditora = $idauditora;
    }

    public function getDescripcion(){
        return $this->descripcion;
    }
    public function setDescripcion($descripcion){
        $this->descripcion = $descripcion;
    }

    public function getIdusuarioasig(){
        return $this->idusuarioasig;
    }
    public function setIdusuarioasig($idusuarioasig){
        $this->idusuarioasig = $idusuarioasig;
    }

}