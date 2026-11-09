<?php
// Iniciar sesión para obtener el ID del usuario actual
session_start();

// Validar que el usuario haya iniciado sesión
// Ajusta 'usuario_id' al nombre exacto que uses en tu script de login
if (!isset($_SESSION['usuario_id'])) {
    die("Error: Debes iniciar sesión para crear un torneo.");
}

require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Recibir datos del formulario
    $nombre = trim($_POST['nombre']);
    $deporte = trim($_POST['deporte']);
    $descripcion = trim($_POST['descripcion']);
    $fecha_inicio = $_POST['fecha_inicio'];
    $fecha_fin = $_POST['fecha_fin'];
    $ubicacion = trim($_POST['ubicacion']);
    $max_participantes = !empty($_POST['max_participantes']) ? (int)$_POST['max_participantes'] : null;
    $formato = trim($_POST['formato']);
    $premio = trim($_POST['premio']);
    
    // Obtener el ID del creador desde la sesión
    $creado_por = $_SESSION['usuario_id']; 

    // 2. Preparar la consulta SQL
    $sql = "INSERT INTO torneos (nombre, deporte, descripcion, fecha_inicio, fecha_fin, ubicacion, max_participantes, formato, premio, creado_por) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
    if ($stmt = $conexion->prepare($sql)) {
        // s = string, i = integer
        $stmt->bind_param("ssssssissi", $nombre, $deporte, $descripcion, $fecha_inicio, $fecha_fin, $ubicacion, $max_participantes, $formato, $premio, $creado_por);
        
        // 3. Ejecutar y verificar
        if ($stmt->execute()) {
            // Redirigir a la lista de torneos o al panel con un mensaje de éxito
            header("Location: ../tournaments.html?mensaje=torneo_creado");
            exit();
        } else {
            echo "Error al crear el torneo: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Error en la preparación de la consulta: " . $conexion->error;
    }
    
    $conexion->close();
} else {
    header("Location: ../create.html");
    exit();
}
?>