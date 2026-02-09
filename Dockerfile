# Stage 1: build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and node_modules
COPY package*.json ./
RUN npm install --production

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy .env if needed
COPY .env ./

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
