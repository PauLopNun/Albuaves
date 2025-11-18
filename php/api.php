<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Verify that the database file exists
$dbPath = 'db/albuaves.db';
if (!file_exists($dbPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Database not found at: $dbPath"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = new SQLite3($dbPath);
    $db->enableExceptions(true);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error connecting to the database: " . $e->getMessage()]);
    exit;
}

switch ($method) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                // Get a bird by ID
                $id = $_GET['id'];
                $stmt = $db->prepare("SELECT * FROM birds WHERE bird_id = :id");
                $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
                $result = $stmt->execute();
                $bird = $result->fetchArray(SQLITE3_ASSOC);

                if ($bird) {
                    echo json_encode($bird);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Bird not found"]);
                }
            } else {
                // Get all birds
                $result = $db->query("SELECT * FROM birds");
                $birds = [];
                while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                    $birds[] = $row;
                }
                echo json_encode($birds);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Query error: " . $e->getMessage()]);
        }
        break;

    case 'OPTIONS':
        // Response for CORS preflight requests
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Unsupported method: $method"]);
        break;
}

$db->close();
?>
