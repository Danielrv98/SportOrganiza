<?php
$host = "localhost";
$user_db = "root";
$pass_db = "";
$bd = "sport-organiza";

$conexion = new mysqli($host, $user_db, $pass_db, $bd);

if ($conexion->connect_errno) {
    die("Error de conexión: " . $conexion->connect_error);
}

$conexion->set_charset("utf8");
?>