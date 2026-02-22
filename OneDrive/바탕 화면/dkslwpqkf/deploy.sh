#!/bin/bash
set -e

# Create necessary directories
mkdir -p nginx/conf.d
mkdir -p certs

# Generate a random JWT secret if not exists
if [ ! -f .jwt_secret ]; then
  openssl rand -base64 32 > .jwt_secret
fi
JWT_SECRET=$(cat .jwt_secret)

# Export environment variables
export JWT_SECRET

# Build and start services
echo "🚀 Starting deployment..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose exec backend npm run migrate:prod

echo "✨ Deployment complete!"
echo "🌐 Frontend: http://localhost:80"
echo "🔌 Backend API: http://localhost:80/api"
echo "📊 Database: http://localhost:8080 (Adminer)"
