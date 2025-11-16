<?php
// Router for PHP built-in server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// If it's api.php or the root, serve api.php
if ($uri === '/api.php' || $uri === '/') {
    include __DIR__ . '/api.php';
    exit;
}

// For anything else, return 404
http_response_code(404);
echo json_encode(['error' => 'Not found']);
