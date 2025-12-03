<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Verify that the database file exists
$dbPath = __DIR__ . '/db/albuaves.db';
if (!file_exists($dbPath)) {
    $dbPath = __DIR__ . '/../db/albuaves.db';
}

if (!file_exists($dbPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Database not found. Tried: " . __DIR__ . '/db/albuaves.db' . " and " . __DIR__ . '/../db/albuaves.db']);
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

    case 'POST':
        try {
            // Handle image upload
            $imageUrl = null;

            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = 'imgs/aves/';

                // Create directory if it doesn't exist
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                // Generate unique filename
                $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $filename = uniqid('bird_') . '.' . $extension;
                $uploadFile = $uploadDir . $filename;

                // Validate file type
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!in_array($_FILES['image']['type'], $allowedTypes)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid file type. Only images are allowed."]);
                    exit;
                }

                // Validate file size (max 5MB)
                if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
                    http_response_code(400);
                    echo json_encode(["error" => "File too large. Maximum size is 5MB."]);
                    exit;
                }

                // Move uploaded file
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                    $imageUrl = $uploadFile;
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error uploading image."]);
                    exit;
                }
            }

            // Get form data
            $commonName = isset($_POST['common_name']) ? trim($_POST['common_name']) : null;
            $scientificName = isset($_POST['scientific_name']) ? trim($_POST['scientific_name']) : null;
            $description = isset($_POST['description']) ? trim($_POST['description']) : '';

            // Validate required fields
            if (!$commonName || !$scientificName) {
                http_response_code(400);
                echo json_encode(["error" => "Missing required fields: common_name, scientific_name"]);
                exit;
            }

            // Insert bird
            $stmt = $db->prepare(
                "INSERT INTO birds (common_name, scientific_name, description, image_url)
                 VALUES (:common_name, :scientific_name, :description, :image_url)"
            );

            $stmt->bindValue(':common_name', $commonName, SQLITE3_TEXT);
            $stmt->bindValue(':scientific_name', $scientificName, SQLITE3_TEXT);
            $stmt->bindValue(':description', $description, SQLITE3_TEXT);
            $stmt->bindValue(':image_url', $imageUrl, SQLITE3_TEXT);

            $result = $stmt->execute();

            if ($result) {
                $birdId = $db->lastInsertRowID();

                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Bird registered successfully",
                    "bird_id" => $birdId,
                    "image_url" => $imageUrl
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error saving bird"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            // Get bird ID from query string
            $birdId = isset($_GET['id']) ? intval($_GET['id']) : null;

            if (!$birdId) {
                http_response_code(400);
                echo json_encode(["error" => "Missing bird ID"]);
                exit;
            }

            // Get bird data to delete associated image
            $stmt = $db->prepare("SELECT image_url FROM birds WHERE bird_id = :id");
            $stmt->bindValue(':id', $birdId, SQLITE3_INTEGER);
            $result = $stmt->execute();
            $bird = $result->fetchArray(SQLITE3_ASSOC);

            if (!$bird) {
                http_response_code(404);
                echo json_encode(["error" => "Bird not found"]);
                exit;
            }

            // Delete all sightings associated with this bird (and their images)
            $stmt = $db->prepare("SELECT image_url FROM sightings WHERE bird_id = :bird_id");
            $stmt->bindValue(':bird_id', $birdId, SQLITE3_INTEGER);
            $result = $stmt->execute();

            while ($sighting = $result->fetchArray(SQLITE3_ASSOC)) {
                if ($sighting['image_url'] && file_exists($sighting['image_url'])) {
                    unlink($sighting['image_url']);
                }
            }

            // Delete sightings from database
            $stmt = $db->prepare("DELETE FROM sightings WHERE bird_id = :bird_id");
            $stmt->bindValue(':bird_id', $birdId, SQLITE3_INTEGER);
            $stmt->execute();

            // Delete the bird from database
            $stmt = $db->prepare("DELETE FROM birds WHERE bird_id = :id");
            $stmt->bindValue(':id', $birdId, SQLITE3_INTEGER);
            $deleteResult = $stmt->execute();

            if ($deleteResult) {
                // Delete associated bird image file if exists
                if ($bird['image_url'] && file_exists($bird['image_url'])) {
                    unlink($bird['image_url']);
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Bird and all associated sightings deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error deleting bird"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error: " . $e->getMessage()]);
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
