<?php
$name = $_FILES['filename']['name'];
$fecha = new DateTime();
if(move_uploaded_file($_FILES['filename']['tmp_name'],$fecha->getTimestamp().$name)){
    echo $fecha->getTimestamp().$name;
}

?>