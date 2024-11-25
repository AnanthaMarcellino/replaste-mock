FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Verify content
RUN ls -la && \
    echo "Content of src:" && \
    ls -la src/

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start command with debugging
CMD echo "Starting application..." && NODE_ENV=production npm start