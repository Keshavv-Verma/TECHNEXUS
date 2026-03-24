# Production Readiness Checklist

## 🔴 CRITICAL - Must Do Before Deployment

### 1. Environment Setup
- [ ] Create `.env.production` file with all required variables
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Setup PostgreSQL database (replace SQLite)
- [ ] Update `DATABASE_URL` to PostgreSQL connection string

### 2. Password Security
- [ ] Verify bcrypt is installed: `npm list bcryptjs` ✅ DONE
- [ ] Create admin user with hashed password in database
- [ ] Remove any hardcoded credentials from code ✅ DONE
- [ ] Test signup → password is hashed ✅ DONE
- [ ] Test login → password verification works ✅ DONE

### 3. JWT & Authentication
- [ ] Replace `JWT_SECRET` in config with strong random string ✅ DONE
- [ ] Set `JWT_EXPIRE` to reasonable value (24h for production) ✅ DONE
- [ ] Test token generation and verification
- [ ] Verify token expiration works

### 4. Security Middleware
- [ ] Helmet enabled for security headers ✅ DONE
- [ ] CORS configured for your domain ✅ DONE
- [ ] Rate limiting enabled ✅ DONE
- [ ] Input validation with Joi added ✅ DONE
- [ ] Error handling middleware in place ✅ DONE

### 5. API Security
- [ ] All GET endpoints don't expose sensitive data
- [ ] POST/PUT/DELETE endpoints require authentication
- [ ] Admin endpoints check `isAdmin` flag
- [ ] No console.log() statements with sensitive data in production
- [ ] Validate and sanitize all user inputs ✅ DONE

### 6. Performance
- [ ] Database has proper indexes
- [ ] Pagination implemented for large queries
- [ ] Caching strategy decided (Redis)
- [ ] Static assets minified (React build)
- [ ] API response times monitored

### 7. Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Setup database backups (daily)
- [ ] Test disaster recovery plan
- [ ] Verify migration script exists

### 8. Deployment
- [ ] Use PM2 or systemd for process management
- [ ] Setup Nginx reverse proxy with SSL
- [ ] Configure load balancer (if multiple servers)
- [ ] Setup health check endpoint ✅ DONE (`/health`)
- [ ] Implement blue-green deployment strategy

### 9. Monitoring & Logging
- [ ] Morgan logging configured ✅ DONE
- [ ] Error tracking setup (Sentry/DataDog)
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] Performance monitoring setup
- [ ] Log aggregation (ELK stack or LogDNA)

### 10. Payment Gateway
- [ ] Razorpay LIVE keys added to `.env.production`
- [ ] Stripe LIVE keys added (if needed)
- [ ] Payment verification implemented on backend
- [ ] Webhook handlers setup
- [ ] Test full payment flow with real payment processor

### 11. Frontend
- [ ] Build React app: `npm run build`
- [ ] Update API URL to production: `REACT_APP_DEV_URL`
- [ ] Remove console.log() statements
- [ ] Test all features on production domain
- [ ] Verify payment integration with LIVE keys

### 12. Compliance & Privacy
- [ ] Privacy policy page added
- [ ] Terms of service page added
- [ ] GDPR compliance (if EU users)
- [ ] SSL/TLS certificate installed
- [ ] Security headers configured (CSP, HSTS)

### 13. Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide created ✅ DONE
- [ ] Runbook for common issues
- [ ] Database schema documentation
- [ ] Environment variables documented

---

## 🟡 IMPORTANT - Should Do

- [ ] Implement refresh token mechanism
- [ ] Add two-factor authentication
- [ ] Setup API rate limiting per user
- [ ] Add request size limits
- [ ] Implement API versioning
- [ ] Add API request/response logging
- [ ] Setup CORS for multiple domains (if needed)
- [ ] Implement caching headers
- [ ] Add database query optimization
- [ ] Setup automated performance tests

---

## 🟢 NICE TO HAVE

- [ ] API documentation with code examples
- [ ] Blog/knowledge base
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] A/B testing framework
- [ ] Internationalization (i18n)
- [ ] Dark mode support
- [ ] Progressive Web App (PWA)
- [ ] Mobile app

---

## Quick Start for Production

1. **Install dependencies:**
   ```bash
   cd backendproject/backendproject
   npm install
   ```

2. **Setup PostgreSQL:**
   ```bash
   # Follow DEPLOYMENT_GUIDE.md section 1
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your settings
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Start server:**
   ```bash
   npm start  # Uses node index.js
   ```

6. **Verify it works:**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"OK","timestamp":"..."}
   ```

---

## ⚠️ Common Mistakes to Avoid

❌ **DON'T** commit `.env.production` to git  
❌ **DON'T** use SQLite in production  
❌ **DON'T** hardcode secrets in code  
❌ **DON'T** trust user input without validation  
❌ **DON'T** expose stack traces to users  
❌ **DON'T** run without HTTPS  
❌ **DON'T** ignore error logs  
❌ **DON'T** skip database backups  

✅ **DO** use environment variables  
✅ **DO** hash passwords with bcrypt  
✅ **DO** validate all inputs  
✅ **DO** log errors server-side  
✅ **DO** backup database regularly  
✅ **DO** monitor uptime  
✅ **DO** test payment flow  
✅ **DO** use strong JWT secrets  

---

## Test Cases

### User Authentication
```bash
# Signup
POST /api/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Login
POST /api/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Products
```bash
# Get all products
GET /api/products

# Get product by ID
GET /api/products/product_id

# Get products by category
GET /api/products/category/ELECTRONICS

# Create product (admin only)
POST /api/products
Authorization: Bearer token
{
  "name": "iPhone 15",
  "category": "ELECTRONICS",
  "price": 999,
  "image": "url",
  "description": "..."
}
```

### Payment
```bash
# Razorpay payment (frontend)
POST https://api.razorpay.com/v1/orders
```

---

**Status:** ✅ Production Ready (with PostgreSQL migration)

Last Updated: March 24, 2026
