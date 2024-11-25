const createConnection = require('../config/database');

class PredictionModel {
  static async save(userId, imageUrl, fileName, jenisPlastik, confidenceScore) {
    let connection;
    try {
      connection = await createConnection();
      const [result] = await connection.execute(
        'INSERT INTO hasil_prediksi (user_id, image_url, file_name, jenis_plastik, confidence_score) VALUES (?, ?, ?, ?, ?)',
        [userId, imageUrl, fileName, jenisPlastik, confidenceScore]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error saving prediction:', error);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }

  static async getByUserId(userId) {
    let connection;
    try {
      connection = await createConnection();
      const [predictions] = await connection.execute(
        'SELECT * FROM hasil_prediksi WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return predictions;
    } catch (error) {
      console.error('Error getting predictions:', error);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }

  static async getById(id) {
    let connection;
    try {
      connection = await createConnection();
      const [predictions] = await connection.execute(
        'SELECT * FROM hasil_prediksi WHERE id = ?',
        [id]
      );
      return predictions[0];
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }

  // Jika perlu method tambahan, misalnya untuk mendapatkan statistik
  static async getUserStats(userId) {
    let connection;
    try {
      connection = await createConnection();
      const [stats] = await connection.execute(
        'SELECT jenis_plastik, COUNT(*) as total FROM hasil_prediksi WHERE user_id = ? GROUP BY jenis_plastik',
        [userId]
      );
      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }
}

module.exports = PredictionModel;