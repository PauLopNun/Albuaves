-- Crear tabla aves
CREATE TABLE aves (
  id_ave INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_comun TEXT NOT NULL,
  nombre_cientifico TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT
);

-- Crear tabla avistamientos
CREATE TABLE avistamientos (
  id_avistamiento INTEGER PRIMARY KEY AUTOINCREMENT,
  id_ave INTEGER NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  ubicacion TEXT NOT NULL,
  observaciones TEXT,
  FOREIGN KEY (id_ave) REFERENCES aves(id_ave)
);
