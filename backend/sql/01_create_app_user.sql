-- ===========================================================
-- JewelTrack: Step 1 - Create Application User
-- Run this from a SYSDBA session in CMD or Oracle admin shell
-- Example: sqlplus / as sysdba @01_create_app_user.sql
-- ===========================================================

-- Drop if exists (safe re-run)
BEGIN
  EXECUTE IMMEDIATE 'DROP USER JEWELTRACK_APP CASCADE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -1918 THEN RAISE; END IF;
END;
/

-- Create application user
CREATE USER JEWELTRACK_APP IDENTIFIED BY "JewelTrack@2024"
  DEFAULT TABLESPACE USERS
  TEMPORARY TABLESPACE TEMP
  ACCOUNT UNLOCK;

-- Quota on USERS tablespace (enough for demo data + indexes)
ALTER USER JEWELTRACK_APP QUOTA UNLIMITED ON USERS;

-- Required privileges for the application
GRANT CREATE SESSION      TO JEWELTRACK_APP;
GRANT CREATE TABLE        TO JEWELTRACK_APP;
GRANT CREATE VIEW         TO JEWELTRACK_APP;
GRANT CREATE SEQUENCE     TO JEWELTRACK_APP;
GRANT CREATE TRIGGER      TO JEWELTRACK_APP;
GRANT CREATE PROCEDURE    TO JEWELTRACK_APP;
GRANT SELECT ANY DICTIONARY TO JEWELTRACK_APP;

-- Allow the application to use the Oracle connection pool
GRANT ALTER SESSION TO JEWELTRACK_APP;

COMMIT;

PROMPT ============================================================
PROMPT  User JEWELTRACK_APP created successfully.
PROMPT  Default password: JewelTrack@2024
PROMPT  Please change in .env before running the backend.
PROMPT ============================================================
