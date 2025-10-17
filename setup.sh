#!/bin/bash

# AI VibeCode Development Setup Script
set -e

echo "🚀 Starting AI VibeCode Development Setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ .env file created. Please review and update the configuration if needed."
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
docker run --rm -v $(pwd)/backend:/app -w /app composer:latest composer install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
docker-compose exec frontend npm install

# Generate application key
echo "🔑 Generating application key..."
docker-compose exec php php artisan key:generate

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec php php artisan migrate --force

# Seed database
echo "🌱 Seeding database..."
docker-compose exec php php artisan db:seed --force

# Warm up cache
echo "🔥 Warming up cache..."
docker-compose exec php php artisan cache:warm-up

# Set proper permissions
echo "🔐 Setting permissions..."
docker-compose exec php chown -R www-data:www-data /var/www/html/storage
docker-compose exec php chmod -R 775 /var/www/html/storage

echo "🎉 Development setup completed successfully!"
echo ""
echo "📊 Application URLs:"
echo "   Frontend: http://localhost:8200"
echo "   Backend API: http://localhost:8201"
echo ""
echo "👤 Test Users:"
echo "   Admin: admin@admin.local / password"
echo "   User: test@example.com / password"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Run tests: docker-compose exec php php artisan test"
echo ""
echo "🔧 Development commands:"
echo "   Backend shell: docker-compose exec php bash"
echo "   Frontend shell: docker-compose exec frontend bash"
echo "   Database shell: docker-compose exec mysql mysql -u root -p"
