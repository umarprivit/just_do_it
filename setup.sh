#!/bin/bash

# DO IT! Platform Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Welcome to DO IT! Platform Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"
        
        # Check if version is 16 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
            echo -e "${RED}✗${NC} Node.js version 16 or higher is required"
            echo "Please install Node.js 16+ from https://nodejs.org/"
            exit 1
        fi
    else
        echo -e "${RED}✗${NC} Node.js is not installed"
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
}

# Check if MongoDB is available
check_mongodb() {
    if command -v mongod &> /dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB is installed locally"
        LOCAL_MONGO=true
    else
        echo -e "${YELLOW}!${NC} MongoDB not found locally"
        echo "You can use MongoDB Atlas (cloud) instead"
        LOCAL_MONGO=false
    fi
}

# Setup backend
setup_backend() {
    echo -e "\n${BLUE}Setting up Backend...${NC}"
    
    cd backend
    
    # Install dependencies
    echo "Installing backend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating backend .env file..."
        cat > .env << EOL
# Database Configuration
MONGO_URI=mongodb://localhost:27017/do-it-platform

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=30d

# Email Configuration (Update with your credentials)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
EOL
        echo -e "${GREEN}✓${NC} Backend .env file created"
        echo -e "${YELLOW}!${NC} Please update the email credentials in backend/.env"
    else
        echo -e "${GREEN}✓${NC} Backend .env file already exists"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    echo -e "\n${BLUE}Setting up Frontend...${NC}"
    
    cd frontend/Tasker
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating frontend .env file..."
        cat > .env << EOL
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=DO IT!
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKETS=true
EOL
        echo -e "${GREEN}✓${NC} Frontend .env file created"
    else
        echo -e "${GREEN}✓${NC} Frontend .env file already exists"
    fi
    
    cd ../..
}

# Create startup scripts
create_scripts() {
    echo -e "\n${BLUE}Creating startup scripts...${NC}"
    
    # Backend start script
    cat > start-backend.sh << 'EOL'
#!/bin/bash
cd backend
echo "Starting DO IT! Backend..."
npm run dev
EOL
    chmod +x start-backend.sh
    
    # Frontend start script
    cat > start-frontend.sh << 'EOL'
#!/bin/bash
cd frontend/Tasker
echo "Starting DO IT! Frontend..."
npm run dev
EOL
    chmod +x start-frontend.sh
    
    # Combined start script
    cat > start-dev.sh << 'EOL'
#!/bin/bash
echo "Starting DO IT! Platform in development mode..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:5173"
echo ""

# Function to handle cleanup
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend in background
cd ../frontend/Tasker && npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOL
    chmod +x start-dev.sh
    
    echo -e "${GREEN}✓${NC} Startup scripts created"
}

# Create package.json for root
create_root_package() {
    if [ ! -f package.json ]; then
        echo "Creating root package.json..."
        cat > package.json << 'EOL'
{
  "name": "do-it-platform",
  "version": "1.0.0",
  "description": "DO IT! Task Management Platform",
  "scripts": {
    "dev": "./start-dev.sh",
    "backend": "./start-backend.sh",
    "frontend": "./start-frontend.sh",
    "install-all": "npm run install-backend && npm run install-frontend",
    "install-backend": "cd backend && npm install",
    "install-frontend": "cd frontend/Tasker && npm install",
    "build": "cd frontend/Tasker && npm run build",
    "test": "cd backend && npm test"
  },
  "keywords": ["task-management", "platform", "react", "nodejs"],
  "license": "MIT"
}
EOL
        echo -e "${GREEN}✓${NC} Root package.json created"
    fi
}

# Main setup function
main() {
    echo "Checking prerequisites..."
    check_node
    check_mongodb
    
    echo -e "\n${BLUE}Starting setup process...${NC}"
    
    setup_backend
    setup_frontend
    create_scripts
    create_root_package
    
    echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo "1. Update email credentials in backend/.env"
    
    if [ "$LOCAL_MONGO" = false ]; then
        echo "2. Set up MongoDB:"
        echo "   - Option A: Install MongoDB locally"
        echo "   - Option B: Create MongoDB Atlas account and update MONGO_URI in backend/.env"
    else
        echo "2. Start MongoDB service:"
        echo "   sudo systemctl start mongod  # Linux"
        echo "   brew services start mongodb-community  # macOS"
    fi
    
    echo -e "\n3. Start the development servers:"
    echo "   ./start-dev.sh"
    echo "   Or separately:"
    echo "   ./start-backend.sh    # Terminal 1"
    echo "   ./start-frontend.sh   # Terminal 2"
    
    echo -e "\n4. Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:5000/api"
    
    echo -e "\n${YELLOW}For detailed documentation, see:${NC}"
    echo "   README.md - General overview and API documentation"
    echo "   docs/DEVELOPMENT.md - Development setup guide"
    echo "   docs/DEPLOYMENT.md - Deployment guide"
    
    echo -e "\n${GREEN}Happy coding! 🚀${NC}"
}

# Run main function
main
