#!/bin/bash

# TECHNEXUS Production Setup Script
# This script automates the setup of the backend for production

set -e

echo "🚀 TECHNEXUS Production Setup"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production file not found!${NC}"
    echo "Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env.production
        echo -e "${GREEN}✅ Created .env.production (EDIT THIS FILE WITH YOUR SETTINGS!)${NC}"
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
        exit 1
    fi
fi

# Check PostgreSQL connection
echo -e "\n${YELLOW}🗄️  Checking database connection...${NC}"
if grep -q "sqlite" .env.production; then
    echo -e "${RED}⚠️  WARNING: You're still using SQLite!${NC}"
    echo "SQLite is not suitable for production. Please migrate to PostgreSQL."
    echo "See DEPLOYMENT_GUIDE.md section 1 for instructions."
fi

# Validate Prisma setup
echo -e "\n${YELLOW}✅ Validating Prisma setup...${NC}"
npx prisma validate

# Generate Prisma Client
echo -e "\n${YELLOW}📦 Generating Prisma Client...${NC}"
npx prisma generate

# Run migrations
echo -e "\n${YELLOW}🔄 Running database migrations...${NC}"
npx prisma migrate deploy || {
    echo -e "${YELLOW}⚠️  Migrations failed. Make sure your database is running.${NC}"
}

# Generate JWT secret if not present
if ! grep -q "JWT_SECRET=" .env.production || grep -q "JWT_SECRET=your-" .env.production; then
    echo -e "\n${YELLOW}🔐 Generating JWT Secret...${NC}"
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    if grep -q "JWT_SECRET=" .env.production; then
        sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env.production
    else
        echo "JWT_SECRET=$JWT_SECRET" >> .env.production
    fi
    echo -e "${GREEN}✅ JWT secret generated and saved${NC}"
fi

# Install PM2 globally
echo -e "\n${YELLOW}🔄 Setting up PM2 (process manager)...${NC}"
npm install -g pm2 || echo "PM2 installation skipped (may need sudo)"

# Create PM2 ecosystem file
echo -e "\n${YELLOW}📝 Creating PM2 ecosystem file...${NC}"
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'technexus-api',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOF
echo -e "${GREEN}✅ PM2 ecosystem file created${NC}"

# Test server
echo -e "\n${YELLOW}🧪 Testing server startup...${NC}"
timeout 5 npm start &
CHILD_PID=$!
sleep 3

if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Server health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Server health check failed. Check logs.${NC}"
fi

kill $CHILD_PID 2>/dev/null || true
wait $CHILD_PID 2>/dev/null || true

# Summary
echo -e "\n${GREEN}✅ SETUP COMPLETE!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.production with your production settings:"
echo "   - Update DATABASE_URL to PostgreSQL"
echo "   - Set JWT_SECRET securely"
echo "   - Add payment gateway keys"
echo "   - Update CORS_ORIGIN to your domain"
echo ""
echo "2. Start the server:"
echo "   npm start"
echo ""
echo "3. Or use PM2 (recommended for production):"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "4. Check the deployment guide:"
echo "   cat DEPLOYMENT_GUIDE.md"
echo ""
echo "📚 Documentation:"
echo "  - DEPLOYMENT_GUIDE.md - Complete deployment instructions"
echo "  - PRODUCTION_READINESS.md - Production checklist"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "  - NEVER commit .env.production to git"
echo "  - Use PostgreSQL in production (not SQLite)"
echo "  - Setup SSL/TLS certificates"
echo "  - Configure firewall rules"
echo ""
