
<?php
$clave = '123456';
$hash = password_hash($clave, PASSWORD_DEFAULT);

echo htmlspecialchars($hash);
