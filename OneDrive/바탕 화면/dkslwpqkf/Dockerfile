# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy source code
WORKDIR /app
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY --from=build /app/backend /app/backend
COPY --from=build /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend

# Install production dependencies only
RUN npm ci --only=production

# Expose ports
EXPOSE 3000 4173

# Start the application
CMD ["npm", "run", "prod"]
