-- Initialize PostgreSQL with PostGIS extension
-- This script runs automatically on first container startup

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS installation
SELECT PostGIS_version();

-- Database structure (tables/indexes) must be managed by backend migrations.
-- Import scripts should only write data into existing tables.
