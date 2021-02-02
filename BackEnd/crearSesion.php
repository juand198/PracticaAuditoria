<?php

    session_start();
    $nombre = $_REQUEST['nombre'];
    $categoria = $_REQUEST['categoria'];
    $idauditora = $_REQUEST['idauditora'];
    $_SESSION['nombre'] = $nombre ;
    $_SESSION['categoria'] = $categoria;
    $_SESSION['idauditora'] = $idauditora;

    echo "OK";
?>