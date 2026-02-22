.PHONY: up down build rebuild logs clean db-shell backend-shell frontend-shell

# Start all services in detached mode
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Build all services
build:
	docker-compose build --no-cache

# Rebuild and restart all services
rebuild: down build up

# View logs for all services
logs:
	docker-compose logs -f

# Clean up all containers, networks, and volumes
clean:
	docker-compose down -v
	docker system prune -f

# Access database shell
db-shell:
	docker-compose exec db psql -U sword_user -d sword_enhancement

# Access backend shell
backend-shell:
	docker-compose exec backend sh

# Access frontend shell
frontend-shell:
	docker-compose exec frontend sh

# Run database migrations
migrate:
	docker-compose exec backend npm run migrate:prod

# Run tests
test:
	docker-compose exec backend npm test

# View service status
status:
	docker-compose ps

# View resource usage
stats:
	docker stats $(docker ps --format '{{.Names}}')

# View logs for a specific service
# Usage: make logs-service SERVICE=backend
logs-service:
	docker-compose logs -f $(SERVICE)
