#!/bin/bash

# AI VibeCode Production Deployment Script
set -e

echo "🚀 Starting AI VibeCode Production Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found. Please create it from .env.example"
    exit 1
fi

# Create production environment file
echo "📝 Creating production environment..."
cp backend/.env.example backend/.env.prod

# Set production environment variables
sed -i.bak 's/APP_ENV=local/APP_ENV=production/' backend/.env.prod
sed -i.bak 's/APP_DEBUG=true/APP_DEBUG=false/' backend/.env.prod
sed -i.bak 's/LOG_LEVEL=debug/LOG_LEVEL=error/' backend/.env.prod

# Generate application key
echo "🔑 Generating application key..."
docker-compose -f docker-compose.prod.yml exec php php artisan key:generate --env=production

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start containers
echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 30

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec php php artisan migrate --force --env=production

# Seed database
echo "Seeding database..."
docker-compose -f docker-compose.prod.yml exec php php artisan db:seed --force --env=production

# Clear and cache configuration
echo "Optimizing application..."
docker-compose -f docker-compose.prod.yml exec php php artisan config:cache --env=production
docker-compose -f docker-compose.prod.yml exec php php artisan route:cache --env=production
docker-compose -f docker-compose.prod.yml exec php php artisan view:cache --env=production

# Warm up cache
echo "Warming up cache..."
docker-compose -f docker-compose.prod.yml exec php php artisan cache:warm-up --env=production

# Set proper permissions
echo "Setting permissions..."
docker-compose -f docker-compose.prod.yml exec php chown -R www-data:www-data /var/www/html/storage
docker-compose -f docker-compose.prod.yml exec php chmod -R 775 /var/www/html/storage

# Health check
echo "Performing health check..."
sleep 10

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "Health check passed!"
else
    echo "Health check failed. Please check the logs."
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

echo "Deployment completed successfully!"
echo "Application is running at: http://localhost"
echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "To stop: docker-compose -f docker-compose.prod.yml down"
