FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file termasuk key.json
COPY . .

# Tambah logging untuk verifikasi
RUN ls -la && \
    echo "Content of directory:" && \
    ls -la

# Expose port
EXPOSE 8080

# Start command
CMD ["npm", "start"]