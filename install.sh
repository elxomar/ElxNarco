#!/bin/bash

# Narco Life RPG - Professional Installation Script
# Automated dependency installation and project setup for 2025
# Handles version conflicts and ensures clean installation

echo "🎮 Narco Life RPG - Professional Installation Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js $NODE_VERSION detected"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION detected"
}

# Clean previous installations
clean_install() {
    print_status "Cleaning previous installation..."
    
    cd frontend
    
    if [ -d "node_modules" ]; then
        print_warning "Removing existing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        print_warning "Removing existing package-lock.json..."
        rm -f package-lock.json
    fi
    
    print_success "Clean-up completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies with legacy peer deps support..."
    
    # Use legacy peer deps to handle version conflicts
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        print_warning "Trying alternative installation method..."
        
        # Alternative method with force flag
        npm install --legacy-peer-deps --force
        
        if [ $? -eq 0 ]; then
            print_success "Dependencies installed with force flag"
        else
            print_error "Installation failed. Please check the error messages above."
            exit 1
        fi
    fi
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check if critical packages are installed
    if [ ! -d "node_modules/react" ]; then
        print_error "React not found in node_modules"
        exit 1
    fi
    
    if [ ! -d "node_modules/vite" ]; then
        print_error "Vite not found in node_modules"
        exit 1
    fi
    
    if [ ! -d "node_modules/tailwindcss" ]; then
        print_error "TailwindCSS not found in node_modules"
        exit 1
    fi
    
    print_success "All critical packages verified"
}

# Test development server
test_dev_server() {
    print_status "Testing development server startup..."
    
    # Start dev server in background and capture PID
    npm run dev &
    DEV_PID=$!
    
    # Wait a few seconds for server to start
    sleep 5
    
    # Check if process is still running
    if kill -0 $DEV_PID 2>/dev/null; then
        print_success "Development server started successfully"
        # Kill the dev server
        kill $DEV_PID
        wait $DEV_PID 2>/dev/null
    else
        print_error "Development server failed to start"
        exit 1
    fi
}

# Create development scripts
create_scripts() {
    print_status "Creating development scripts..."
    
    # Create start script
    cat > ../start-dev.sh << 'EOF'
#!/bin/bash
echo "🎮 Starting Narco Life RPG Development Server..."
cd frontend
npm run dev
EOF
    
    # Create build script
    cat > ../build-prod.sh << 'EOF'
#!/bin/bash
echo "🎮 Building Narco Life RPG for Production..."
cd frontend
npm run build
echo "✅ Build completed! Check the 'dist' folder."
EOF
    
    # Make scripts executable
    chmod +x ../start-dev.sh
    chmod +x ../build-prod.sh
    
    print_success "Development scripts created"
}

# Main installation process
main() {
    echo "Starting installation process..."
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    
    # Navigate to frontend directory
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found. Please run this script from the project root."
        exit 1
    fi
    
    # Clean and install
    clean_install
    install_dependencies
    verify_installation
    test_dev_server
    
    # Go back to root directory
    cd ..
    
    # Create helper scripts
    create_scripts
    
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "📱 Mobile-First Features Installed:"
    echo "   ✅ Responsive HUD with hamburger menu"
    echo "   ✅ Back button navigation on all pages"
    echo "   ✅ Touch-friendly interface elements"
    echo "   ✅ Professional animations and transitions"
    echo "   ✅ iOS-ready mobile optimizations"
    echo ""
    echo "🚀 Quick Start Commands:"
    echo "   Development: ./start-dev.sh"
    echo "   Production:  ./build-prod.sh"
    echo ""
    echo "🌐 Development server will be available at:"
    echo "   http://localhost:5173"
    echo ""
    echo "📱 For mobile testing, use your local IP:"
    echo "   http://[your-ip]:5173"
    echo ""
    print_success "Ready for professional game development! 🎮"
}

# Run main function
main