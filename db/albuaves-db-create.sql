-- Create birds table
CREATE TABLE birds (
  bird_id INTEGER PRIMARY KEY AUTOINCREMENT,
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

-- Create sightings table
CREATE TABLE sightings (
  sighting_id INTEGER PRIMARY KEY AUTOINCREMENT,
  bird_id INTEGER NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  observations TEXT,
  FOREIGN KEY (bird_id) REFERENCES birds(bird_id)
);
