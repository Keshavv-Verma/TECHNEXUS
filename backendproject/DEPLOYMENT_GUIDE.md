# TECHNEXUS - Deployment Guide

## Overview

This guide walks you through deploying the TECHNEXUS e-commerce platform to production. The project includes both frontend (React) and backend (Node.js + Prisma).

---

## ✅ Pre-Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Tests passing
- [ ] Environment variables configured
- [ ] Database migrated to PostgreSQL
- [ ] Passwords hashed with bcrypt
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SSL/TLS certificates obtained
- [ ] Monitoring and logging setup

---

## 🗄️ **1. Database Migration (SQLite → PostgreSQL)**

### Why?
SQLite is single-threaded and breaks under concurrent load. PostgreSQL handles thousands of simultaneous connections.

### Steps:

#### 1.1 Install PostgreSQL
```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Or use Docker
docker run --name postgres-db \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=technexus_prod \
  -p 5432:5432 \
  -d postgres:15
```

#### 1.2 Update Prisma Schema
Edit `backendproject/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

#### 1.3 Update Environment Variables
Create `.env.production`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/technexus_prod"
NODE_ENV=production
JWT_SECRET=your-super-secret-key-min-32-chars-CHANGE_ME
PORT=5000
```

#### 1.4 Run Migrations
```bash
# Generate migration from existing schema
cd backendproject/backendproject
npx prisma migrate dev --name init

# Deploy to production database
npx prisma migrate deploy
```

#### 1.5 Seed Data (Optional)
```bash
npx prisma db seed
```

---

## 🔐 **2. Security Hardening**

### 2.1 Password Security
✅ **Already implemented**: Passwords are now hashed with bcrypt.

### 2.2 JWT Secret
Generate a strong JWT secret:
```bash
# Generate 32+ character random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `.env.production`:
```bash
JWT_SECRET=your_generated_32_char_secret_here
JWT_EXPIRE=24h
```

### 2.3 Admin User Setup
Create an admin user in the database:
```bash
node
> const bcrypt = require('bcryptjs');
> const hash = await bcrypt.hash('SECURE_ADMIN_PASSWORD', 10);
> console.log(hash);
```

Then insert into database:
```sql
INSERT INTO users (id, name, email, password, isAdmin, createdAt, updatedAt)
VALUES (
  'admin_id_cuid',
  'Admin',
  'admin@technexus.com',
  'bcrypt_hash_here',
  true,
  NOW(),
  NOW()
);
```

### 2.4 Enable HTTPS/SSL
Use Let's Encrypt with Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

Update CORS in `.env.production`:
```bash
CORS_ORIGIN=https://yourdomain.com
```

---

## 📦 **3. Backend Deployment**

### 3.1 Install Dependencies
```bash
cd backendproject/backendproject
npm install
npm install -g pm2  # Process manager for Node.js
```

### 3.2 Build & Test
```bash
npm run build  # If you have a build script
npm test

# Health check
curl http://localhost:5000/health
```

### 3.3 Deploy with PM2
```bash
# Start application
pm2 start index.js --name "technexus-api"

# Create startup script
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs technexus-api
```

### 3.4 Setup Reverse Proxy (Nginx)
Create `/etc/nginx/sites-available/technexus`:
```nginx
server {
    listen 443 ssl http2;
    server_name api.technexus.com;

    ssl_certificate /etc/letsencrypt/live/technexus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/technexus.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.technexus.com;
    return 301 https://$server_name$request_uri;
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/technexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🎨 **4. Frontend Deployment**

### 4.1 Build React App
```bash
cd e-comm-project
npm install
npm run build
```

### 4.2 Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### 4.3 Or Deploy to Nginx
```bash
# Copy build files
sudo cp -r build/* /var/www/technexus/

# Create Nginx config
sudo nano /etc/nginx/sites-available/technexus-frontend
```

```nginx
server {
    listen 443 ssl http2;
    server_name technexus.com;

    ssl_certificate /etc/letsencrypt/live/technexus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/technexus.com/privkey.pem;

    root /var/www/technexus;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api.technexus.com;
    }
}
```

---

## 🚀 **5. Environment Variables Setup**

### Backend (.env.production)
```bash
# Environment
NODE_ENV=production

# Server
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/technexus_prod

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=24h

# CORS
CORS_ORIGIN=https://technexus.com

# Payment Gateways (Get from Razorpay/Stripe LIVE accounts)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=50

# Logging
LOG_LEVEL=info
```

### Frontend (.env.production)
```bash
REACT_APP_DEV_URL=https://api.technexus.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxx
REACT_APP_STRIPE_APP_KEY=pk_live_xxxxx
```

---

## 📊 **6. Monitoring & Logging**

### 6.1 Setup Winston Logger
```bash
npm install winston
```

Create `backendproject/logger.js`:
```javascript
const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

### 6.2 Setup PM2 Monitoring
```bash
pm2 web
# Access dashboard at http://localhost:9615
```

### 6.3 Setup Uptime Monitoring
- Use UptimeRobot (free)
- Monitor: `https://api.technexus.com/health`

---

## 🧪 **7. Testing Before Deployment**

```bash
# Backend health check
curl https://api.technexus.com/health

# Login test
curl -X POST https://api.technexus.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Product fetch test
curl https://api.technexus.com/api/products
```

---

## 🔄 **8. CI/CD Pipeline (GitHub Actions)**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy backend
        run: |
          ssh user@server 'cd /app && git pull && npm install && npx prisma migrate deploy && pm2 restart technexus-api'
      
      - name: Deploy frontend
        run: |
          npm run build
          aws s3 sync build/ s3://technexus-bucket/
```

---

## 🆘 **Troubleshooting**

### Port 5000 already in use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U user -d technexus_prod -h localhost
```

### Rate limiting too strict
Adjust in `.env.production`:
```bash
RATE_LIMIT_MAX_REQUESTS=200  # Increase limit
```

### CORS errors
Ensure `CORS_ORIGIN` matches your frontend domain exactly.

---

## 📋 **Deployment Checklist (Final)**

- [ ] Database migrated and tested
- [ ] All environment variables set
- [ ] SSL certificates installed
- [ ] Backend running with PM2
- [ ] Frontend deployed and accessible
- [ ] Health endpoint responding
- [ ] Login/logout working
- [ ] Products loading correctly
- [ ] Payments working (test mode first)
- [ ] Monitoring and alerts configured
- [ ] Backups scheduled
- [ ] Logging configured
- [ ] Security headers enabled (Helmet)
- [ ] Rate limiting active
- [ ] CORS properly configured

---

## Support

For issues, check logs:
```bash
pm2 logs technexus-api
tail -f /var/log/nginx/error.log
```

Good luck! 🚀
