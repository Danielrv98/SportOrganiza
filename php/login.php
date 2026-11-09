<?php
session_start();
include 'conexion.php';

if (isset($_POST['btn_login'])) {
    $user = $_POST['usuario'];
    $pass_ingresada = $_POST['clave'];

    $stmt = $conexion->prepare("SELECT u.id, u.usuario, u.clave, r.nombre_rol 
                                 FROM usuarios u 
                                 INNER JOIN roles r ON u.rol_id = r.id 
                                 WHERE u.usuario = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $datos = $resultado->fetch_assoc();

        if (password_verify($pass_ingresada, $datos['clave'])) {
            $_SESSION['loggedin'] = true;
            $_SESSION['usuario'] = $datos['usuario'];
            $_SESSION['rol'] = $datos['nombre_rol'];

            // Activamos el permiso en JS y redirigimos al panel
            echo "<script>
                    sessionStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'panel.php';
                  </script>";
            exit;
        } else {
            echo "<script>alert('Contraseña incorrecta'); window.location='../login.html';</script>";
        }
    } else {
        echo "<script>alert('El usuario no existe'); window.location='../login.html';</script>";
    }

    $stmt->close();
    $conexion->close();
}
?>