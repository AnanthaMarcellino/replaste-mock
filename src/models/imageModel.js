const createConnection = require('../config/database');

class ImageModel {
  static async save(userId, imageUrl, fileName) {
    let connection;
    try {
      connection = await createConnection();
      const [result] = await connection.execute(
        'INSERT INTO user_images (user_id, image_url, file_name) VALUES (?, ?, ?)',
        [userId, imageUrl, fileName]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }

  static async getByUserId(userId) {
    let connection;
    try {
      connection = await createConnection();
      const [images] = await connection.execute(
        'SELECT * FROM user_images WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return images;
    } catch (error) {
      console.error('Error getting images:', error);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }
}

module.exports = ImageModel;