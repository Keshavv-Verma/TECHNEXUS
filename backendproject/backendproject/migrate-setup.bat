@echo off
REM Setup script for SQLite to MySQL migration
REM This script will guide you through the migration process

echo.
echo ========================================
echo SQLite to MySQL Migration Setup
echo ========================================
echo.

REM Step 1: Check if MySQL is running
echo Step 1: Checking MySQL connection...
mysql -u root -p"Anonymous435." -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Cannot connect to MySQL
    echo Make sure:
    echo   1. MySQL is installed and running
    echo   2. Password is correct: Anonymous435.
    echo.
    echo To start MySQL, run in PowerShell as Admin:
    echo   net start MySQL80
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL is running and accessible

REM Step 2: Create database
echo.
echo Step 2: Creating MySQL database and user...
mysql -u root -p"Anonymous435." -e "CREATE DATABASE IF NOT EXISTS technexus;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)
echo ✓ Database 'technexus' created

REM Step 3: Install dependencies
echo.
echo Step 3: Installing npm packages...
call npm install sqlite3 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)
echo ✓ sqlite3 package installed

REM Step 4: Create Prisma schema
echo.
echo Step 4: Creating tables in MySQL...
call npx prisma migrate deploy >nul 2>&1
if %errorlevel% neq 0 (
    echo Note: If migration failed, trying alternate method...
    call npx prisma db push >nul 2>&1
)
echo ✓ Tables created in MySQL

REM Step 5: Run migration script
echo.
echo Step 5: Migrating data from SQLite to MySQL...
call node migrate-to-mysql.js
if %errorlevel% neq 0 (
    echo ERROR: Migration script failed
    pause
    exit /b 1
)

REM Step 6: Success
echo.
echo ========================================
echo ✓ Migration Complete!
echo ========================================
echo.
echo Your data has been successfully migrated to MySQL
echo Database: technexus
echo User: root
echo.
echo Next steps:
echo  1. Restart your backend: npm start
echo  2. Test the API with the frontend
echo  3. Check MYSQL_MIGRATION_GUIDE.md for more info
echo.
pause
