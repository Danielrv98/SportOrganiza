<?php
require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../register.html");
    exit;
}

$nombre   = trim($_POST['nombre']);
$usuario  = trim($_POST['usuario']);
$email    = trim($_POST['email']);
$password = $_POST['password'];
$rol_id   = 2; // Usuario

if ($nombre === '' || $usuario === '' || $email === '' || $password === '') {
    die("Error: Todos los campos son obligatorios.");
}

$clave = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conexion->prepare(
        "INSERT INTO usuarios (nombre, usuario, email, clave, rol_id) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("ssssi", $nombre, $usuario, $email, $clave, $rol_id);
    $stmt->execute();
    $stmt->close();
    $conexion->close();

    echo "<script>alert('Registro exitoso. Ahora inicia sesión.'); window.location='../login.html';</script>";
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        echo "<script>alert('El usuario o el correo ya están registrados.'); window.history.back();</script>";
    } else {
        echo "Error al registrar: " . htmlspecialchars($e->getMessage());
    }
}
?>