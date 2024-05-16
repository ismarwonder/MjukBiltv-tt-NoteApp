<?php
// Exempel på anslutning till databasen och enkel GET-förfrågan
$mysqli = new mysqli("localhost", "username", "password", "databaseName");

if ($mysqli -> connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
    exit();
}

// Fler exempel på databasoperationer här
$mysqli->close();
?>
