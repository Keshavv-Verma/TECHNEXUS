# SQLite to MySQL Migration Guide

## Step 1: Verify MySQL is Running

### On Windows (using Command Prompt as Admin):
```bash
# Check if MySQL service is running
mysql -u root -p

# Enter your password: Anonymous435.
```

If successful, you'll see the `mysql>` prompt.

---

## Step 2: Create MySQL Database and User

Once logged in to MySQL, run these commands:

```sql
-- Create database
CREATE DATABASE technexus;

-- Create user (optional but recommended for security)
CREATE USER 'technexus_user'@'localhost' IDENTIFIED BY 'technexus_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON technexus.* TO 'technexus_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

---

## Step 3: Update Environment Variables

Update your `.env` file in `backendproject/backendproject/` with:

### Option A: Using Root User (Simpler)
```env
DATABASE_URL="mysql://root:Anonymous435.@localhost:3306/technexus"
```

### Option B: Using Dedicated User (Safer)
```env
DATABASE_URL="mysql://technexus_user:technexus_password@localhost:3306/technexus"
```

---

## Step 4: Install sqlite3 Package (Required for Migration)

```bash
cd d:\PROJECTS\technexus_Sem5\ latest\backendproject\backendproject
npm install sqlite3
```

---

## Step 5: Create Prisma Schema in MySQL

This will create all tables automatically:

```bash
npx prisma migrate deploy
```

If the above doesn't work, use:
```bash
npx prisma db push
```

---

## Step 6: Run the Migration Script

This will transfer all your data from SQLite to MySQL:

```bash
node migrate-to-mysql.js
```

**Expected Output:**
```
🔄 Starting SQLite to MySQL migration...

📖 Reading data from SQLite...
  ⬇️  Exporting Categories...
     ✅ 2 categories exported
  ⬇️  Exporting Users...
     ✅ 1 users exported
  ⬇️  Exporting Products...
     ✅ 50 products exported
  ... (more items)

✅ Data exported to migration-data.json

📥 Importing data to MySQL...
  ⬆️  Importing Categories...
     ✅ 2 categories imported
  ... (more items)

🎉 Migration completed successfully!
```

---

## Step 7: Verify Migration

### Check MySQL has the data:
```bash
mysql -u root -p
```

Then in MySQL:
```sql
USE technexus;
SELECT COUNT(*) FROM User;
SELECT COUNT(*) FROM Product;
SELECT COUNT(*) FROM Category;
```

You should see counts matching your SQLite data.

---

## Step 8: Test Your API

Restart your backend:
```bash
cd d:\PROJECTS\technexus_Sem5\ latest\backendproject\backendproject
npm start
```

Test the API:
```bash
curl http://localhost:5000/api/products
```

---

## Step 9: Update .env Files for Production

Update `.env.production.example` with MySQL connection string:

```env
DATABASE_URL="mysql://username:password@your-production-host:3306/technexus"
JWT_SECRET=your-32-character-random-string
NODE_ENV=production
PORT=5000
```

---

## Troubleshooting

### "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check your password is correct
- Verify port 3306 is not blocked

### "Unknown database 'technexus'"
- Run the database creation commands again
- Make sure you flushed privileges

### "Prisma migration failed"
- Delete the old migrations folder (if safe):
  ```bash
  rm -r prisma/migrations
  ```
- Run `npx prisma migrate dev`

### "Migration script not reading SQLite data"
- Make sure `dev.db` file exists in the project root
- Ensure sqlite3 npm package is installed

---

## Keeping SQLite as Backup

After successful migration, you can keep `dev.db` as a backup:
```bash
copy dev.db dev.db.backup
```

Or delete it if you want:
```bash
del dev.db
```

---

## Next Steps

1. ✅ Test all API endpoints thoroughly
2. ✅ Verify frontend still works with MySQL
3. ✅ Check admin dashboard functions
4. ✅ Test user login and product filtering
5. ✅ Consider setting up automated backups for MySQL

---

## MySQL Administration Tips

### Backup database:
```bash
mysqldump -u root -p technexus > backup.sql
```

### Restore from backup:
```bash
mysql -u root -p technexus < backup.sql
```

### Monitor database:
```bash
mysql -u root -p -e "SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA='technexus';"
```

---

Questions? The migration script logs everything, so check the output carefully!
