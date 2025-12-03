#!/usr/bin/env python3
import sqlite3
import os

# Paths
db_path = 'db/albuaves.db'
create_sql = 'db/albuaves-db-create.sql'
populate_sql = 'db/albuaves-tables-population.sql'

# Remove old database
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"✓ Removed old database")

# Create new database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Read and execute create script
with open(create_sql, 'r') as f:
    cursor.executescript(f.read())
print(f"✓ Created tables")

# Read and execute populate script
with open(populate_sql, 'r') as f:
    cursor.executescript(f.read())
print(f"✓ Populated tables")

# Count records
bird_count = cursor.execute('SELECT COUNT(*) FROM birds').fetchone()[0]
sighting_count = cursor.execute('SELECT COUNT(*) FROM sightings').fetchone()[0]

print(f"\n✓ Database recreated successfully!")
print(f"  - Birds: {bird_count}")
print(f"  - Sightings: {sighting_count}")

conn.commit()
conn.close()
