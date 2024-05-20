<?php
$host = 'localhost';
$username = 'root';
$password = 'password';
$dbname = 'notes';

$mysqli = new mysqli($host, $username, $password, $dbname);

if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error]);
    exit();
}

// Läs in operation från kommandoradens parameter
$operation = $argv[1] ?? null;

// Hantera olika typer av förfrågningar
switch ($operation) {
    case 'create':
        $content = json_decode($argv[2], true)['content'] ?? '';
        createNote($content, $mysqli);
        break;
    case 'read':
        readNotes($mysqli);
        break;
    case 'update':
        $id = $argv[2] ?? null;
        $content = json_decode($argv[3], true)['content'] ?? '';
        updateNote($id, $content, $mysqli);
        break;
    case 'delete':
        $id = $argv[2] ?? null;
        if ($id !== null) {
            deleteNote($id, $mysqli);
        } else {
            echo json_encode(['error' => 'Missing note ID']);
        }
        break;
    default:
        echo json_encode(['error' => 'Invalid operation requested']);
        exit();
}

$mysqli->close();

function createNote($content, $mysqli) {
    if (empty($content)) {
        echo json_encode(['error' => 'Content cannot be empty']);
        return;
    }

    $stmt = $mysqli->prepare('INSERT INTO notes (content) VALUES (?)');
    if (!$stmt) {
        echo json_encode(['error' => $mysqli->error]);
        return;
    }

    $stmt->bind_param('s', $content);
    if ($stmt->execute()) {
        echo json_encode(["id" => $stmt->insert_id, "content" => $content]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    $stmt->close();
}

function readNotes($mysqli) {
    $result = $mysqli->query('SELECT id, content FROM notes');
    if (!$result) {
        echo json_encode(['error' => $mysqli->error]);
        return;
    }

    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    echo json_encode($notes);
    $result->free();
}

function updateNote($id, $content, $mysqli) {
    $stmt = $mysqli->prepare('UPDATE notes SET content = ? WHERE id = ?');
    if (!$stmt) {
        echo json_encode(['error' => $mysqli->error]);
        return;
    }

    $stmt->bind_param('si', $content, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Record updated successfully']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    $stmt->close();
}

function deleteNote($id, $mysqli) {
    $stmt = $mysqli->prepare('DELETE FROM notes WHERE id = ?');
    if (!$stmt) {
        echo json_encode(['error' => $mysqli->error]);
        return;
    }

    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Record deleted successfully']);
        } else {
            echo json_encode(['error' => 'Note not found']);
        }
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    $stmt->close();
}

?>
