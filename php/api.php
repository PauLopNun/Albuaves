<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Verificar que el archivo de base de datos existe
$dbPath = 'db/albuaves.db';
if (!file_exists($dbPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Base de datos no encontrada en: $dbPath"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = new SQLite3($dbPath);
    $db->enableExceptions(true);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al conectar con la base de datos: " . $e->getMessage()]);
    exit;
}

switch ($method) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                // Obtener un ave por ID
                $id = $_GET['id'];
                $stmt = $db->prepare("SELECT * FROM aves WHERE id_ave = :id");
                $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
                $result = $stmt->execute();
                $ave = $result->fetchArray(SQLITE3_ASSOC);

                if ($ave) {
                    echo json_encode($ave);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Ave no encontrada"]);
                }
            } else {
                // Obtener todas las aves
                $result = $db->query("SELECT * FROM aves");
                $aves = [];
                while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                    $aves[] = $row;
                }
                echo json_encode($aves);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
        }
        break;

    case 'OPTIONS':
        // Respuesta para peticiones preflight CORS
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no soportado: $method"]);
        break;
}

$db->close();
?>
