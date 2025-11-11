<?php
// Router para el servidor PHP built-in
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Si es api.php o la raíz, servir api.php
if ($uri === '/api.php' || $uri === '/') {
    include __DIR__ . '/api.php';
    exit;
}

// Para cualquier otra cosa, devolver 404
http_response_code(404);
echo json_encode(['error' => 'Not found']);
