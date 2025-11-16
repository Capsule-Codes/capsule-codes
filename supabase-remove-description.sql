-- Remove description column from technologies table
ALTER TABLE technologies DROP COLUMN IF EXISTS description;
