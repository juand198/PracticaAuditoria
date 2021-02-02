<?php
$ruta = $_REQUEST['ruta'];
$resultado = unlink($ruta);
echo "OK";

?>