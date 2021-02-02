<?php

// Esta clase representa un Usuario

class Auditora
{
    // Variables de clase
    private $id, $nombre;

    // Constructor
    public function __construct($id, $nombre)
    {
        $this->id = $id;
        $this->nombre = $nombre;
    }

    public function getNombre(){
        return $this->nombre;
    }

    public function getId(){
        return $this->id;
    }

}