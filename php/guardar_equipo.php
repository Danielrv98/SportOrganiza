<?php
session_start();

// Validar que el usuario haya iniciado sesión
if (!isset($_SESSION['usuario_id'])) {
    die("Error: Debes iniciar sesión para registrar un equipo.");
}

require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $deporte = trim($_POST['deporte']);
    $creado_por = $_SESSION['usuario_id'];

    if (empty($nombre) || empty($deporte)) {
        die("Error: Nombre y deporte son obligatorios.");
    }

    $sql = "INSERT INTO equipos (nombre, deporte, creado_por) VALUES (?, ?, ?)";
    
    if ($stmt = $conexion->prepare($sql)) {
        $stmt->bind_param("ssi", $nombre, $deporte, $creado_por);
        
        if ($stmt->execute()) {
            header("Location: ../teams.php?mensaje=equipo_creado");
            exit();
        } else {
            echo "Error al registrar el equipo: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Error en la consulta: " . $conexion->error;
    }
    
    $conexion->close();
} else {
    header("Location: ../teams.php");
    exit();
}
?>