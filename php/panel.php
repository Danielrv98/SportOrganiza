
<?php
require_once __DIR__ . '/auth_check.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Principal - Sport Organize</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body style="padding: 40px;">

    <h1>
        ¡Bienvenido,
        <?php echo htmlspecialchars($_SESSION['usuario'], ENT_QUOTES, 'UTF-8'); ?>!
    </h1>

    <p>
        Tu rol en el sistema es:
        <strong>
            <?php echo htmlspecialchars($_SESSION['rol'], ENT_QUOTES, 'UTF-8'); ?>
        </strong>
    </p>

    <hr style="margin: 20px 0;">

    <a href="logout.php" class="btn btn-primary">
        Cerrar sesión
    </a>

</body>
</html>
