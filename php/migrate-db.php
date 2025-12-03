<?php
// Migration script to add image_url to sightings table
$dbPath = __DIR__ . '/db/albuaves.db';
if (!file_exists($dbPath)) {
    $dbPath = __DIR__ . '/../db/albuaves.db';
}

try {
    $db = new SQLite3($dbPath);
    $db->enableExceptions(true);

    // Check if column already exists
    $columns = $db->query("PRAGMA table_info(sightings)");
    $hasImageUrl = false;

    while ($column = $columns->fetchArray(SQLITE3_ASSOC)) {
        if ($column['name'] === 'image_url') {
            $hasImageUrl = true;
            break;
        }
    }

    if (!$hasImageUrl) {
        $db->exec("ALTER TABLE sightings ADD COLUMN image_url TEXT");
        echo "Migration successful: Added image_url column to sightings table\n";
    } else {
        echo "Migration skipped: image_url column already exists\n";
    }

    $db->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
