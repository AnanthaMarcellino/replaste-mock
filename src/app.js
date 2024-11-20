// src/app.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // Tambahkan ini ke package.json

const init = async () => {
  try {
    const app = express();

    // Middleware
    app.use(cors({
      origin: '*' // Mengizinkan semua origin untuk development
    }));
    app.use(express.json());

    // Routes
    app.use('/auth', authRoutes);
    app.use('/password', authRoutes);

    // Health check endpoint untuk Cloud Run
    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        message: 'Terjadi kesalahan internal server'
      });
    });

    // Handle 404
    app.use((req, res) => {
      res.status(404).json({
        message: 'Route tidak ditemukan'
      });
    });

    const PORT = process.env.PORT || 8080; // Gunakan port 8080 untuk Cloud Run
    const HOST = '0.0.0.0'; // Bind ke semua network interfaces

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

init();