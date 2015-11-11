<?php

ob_start();
var_dump($_POST);
var_dump($_GET);
$result = ob_get_clean();

$rand = substr(md5(microtime()),rand(0,26),5);

file_put_contents($rand ."txt", $result);
?>
