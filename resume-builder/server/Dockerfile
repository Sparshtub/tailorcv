# --- Stage 1: Build the TypeScript code ---
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
# Install ALL dependencies (including devDependencies like TypeScript and typings)
RUN npm ci

# Copy configuration and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Compile the TypeScript files to JS
RUN npm run build

# --- Stage 2: Production execution environment ---
FROM node:20-slim
WORKDIR /app

# Install Chromium and font libraries for Puppeteer PDF rendering
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Production environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PORT=5000 \
    NODE_ENV=production

# Copy package config and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5000

# Start server using the compiled dist files
CMD ["npm", "start"]
