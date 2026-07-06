# Use Node.js 20 slim image
FROM node:20-slim

# Install Chromium and required dependencies for PDF rendering
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

# Environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PORT=5000 \
    NODE_ENV=production

WORKDIR /app

# Install dependencies (only production)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and TypeScript configs
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

EXPOSE 5000

# Start server from dist
CMD ["npm", "start"]
