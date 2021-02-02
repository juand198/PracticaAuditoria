<?php
$fileName = $_REQUEST['nombre'];
$downloadFileName = $filename;

if (file_exists($fileName)) {
       header('Content-Description: File Transfer');
       header('Content-Type: text/csv');
       header('Content-Disposition: attachment; filename='.$downloadFileName);
       ob_clean();
       flush();
       readfile($fileName);
       exit;
}
?>