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
            // Get all sightings with bird information
            $query = "SELECT s.*, b.common_name, b.scientific_name
                      FROM sightings s
                      JOIN birds b ON s.bird_id = b.bird_id
                      ORDER BY s.date DESC, s.time DESC";

            $result = $db->query($query);
            $sightings = [];

            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $sightings[] = $row;
            }

            echo json_encode($sightings);
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
                $uploadDir = 'imgs/sightings/';

                // Create directory if it doesn't exist
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                // Generate unique filename
                $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $filename = uniqid('sighting_') . '.' . $extension;
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
            $birdId = isset($_POST['bird_id']) ? intval($_POST['bird_id']) : null;
            $date = isset($_POST['date']) ? $_POST['date'] : null;
            $time = isset($_POST['time']) ? $_POST['time'] : null;
            $location = isset($_POST['location']) ? $_POST['location'] : null;
            $observations = isset($_POST['observations']) ? $_POST['observations'] : null;

            // Validate required fields
            if (!$birdId || !$date || !$time || !$location) {
                http_response_code(400);
                echo json_encode(["error" => "Missing required fields: bird_id, date, time, location"]);
                exit;
            }

            // Insert sighting
            $stmt = $db->prepare(
                "INSERT INTO sightings (bird_id, date, time, location, observations, image_url)
                 VALUES (:bird_id, :date, :time, :location, :observations, :image_url)"
            );

            $stmt->bindValue(':bird_id', $birdId, SQLITE3_INTEGER);
            $stmt->bindValue(':date', $date, SQLITE3_TEXT);
            $stmt->bindValue(':time', $time, SQLITE3_TEXT);
            $stmt->bindValue(':location', $location, SQLITE3_TEXT);
            $stmt->bindValue(':observations', $observations, SQLITE3_TEXT);
            $stmt->bindValue(':image_url', $imageUrl, SQLITE3_TEXT);

            $result = $stmt->execute();

            if ($result) {
                $sightingId = $db->lastInsertRowID();

                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Sighting registered successfully",
                    "sighting_id" => $sightingId,
                    "image_url" => $imageUrl
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error saving sighting"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            // Get sighting ID from query string
            $sightingId = isset($_GET['id']) ? intval($_GET['id']) : null;

            if (!$sightingId) {
                http_response_code(400);
                echo json_encode(["error" => "Missing sighting ID"]);
                exit;
            }

            // Get sighting data to delete associated image
            $stmt = $db->prepare("SELECT image_url FROM sightings WHERE sighting_id = :id");
            $stmt->bindValue(':id', $sightingId, SQLITE3_INTEGER);
            $result = $stmt->execute();
            $sighting = $result->fetchArray(SQLITE3_ASSOC);

            if (!$sighting) {
                http_response_code(404);
                echo json_encode(["error" => "Sighting not found"]);
                exit;
            }

            // Delete the sighting from database
            $stmt = $db->prepare("DELETE FROM sightings WHERE sighting_id = :id");
            $stmt->bindValue(':id', $sightingId, SQLITE3_INTEGER);
            $deleteResult = $stmt->execute();

            if ($deleteResult) {
                // Delete associated image file if exists
                if ($sighting['image_url'] && file_exists($sighting['image_url'])) {
                    unlink($sighting['image_url']);
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Sighting deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error deleting sighting"]);
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
