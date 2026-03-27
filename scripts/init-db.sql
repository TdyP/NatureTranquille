-- Initialize PostgreSQL with PostGIS extension
-- This script runs automatically on first container startup

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS installation
SELECT PostGIS_version();

-- Create zones_sans_chasse table (will be populated by import script)
-- Structure will be created by the import script in Story 0.2
