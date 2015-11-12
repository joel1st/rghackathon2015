<?php
$inputJSON = file_get_contents('php://input');
echo $inputJSON;
echo "POST<br>";
var_dump($_POST);
echo "<br>GET<br>";
var_dump($_GET);

ob_start();
var_dump($_POST);
var_dump($_GET);
$result = ob_get_clean();
$result .= "input" .$inputJSON;
$rand = substr(md5(microtime()),rand(0,26),5);

file_put_contents($rand ."txt", $result);
?>
