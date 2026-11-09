<?php
session_start();
$_SESSION = array();
session_destroy();

echo "<script>
        sessionStorage.removeItem('isLoggedIn');
        alert('Has cerrado sesión correctamente.');
        window.location.href = '../login.html';
      </script>";
exit;
?>