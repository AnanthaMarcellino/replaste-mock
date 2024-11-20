const pool = require('../config/database');

class UserModel {
  static async create(email, hashedPassword, fullName) {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, hashedPassword, fullName]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
  }

  static async findById(id) {
    const [users] = await pool.execute(
      'SELECT id, email, full_name, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return users[0];
  }
  
  static async updateResetToken(userId, resetToken, resetTokenExpiry) {
    try {
        const [result] = await pool.execute(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, userId]
        );
        
        // Tambahkan log untuk memastikan update berhasil
        console.log('Update result:', {
            userId,
            resetToken,
            resetTokenExpiry,
            affectedRows: result.affectedRows
        });

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating reset token:', error);
        throw error;
    }
}

  static async findByResetToken(resetToken) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [resetToken]
    );
    return users[0];
  }

  static async updatePassword(userId, hashedPassword) {
    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, userId]
    );
  }

  static async findById(id) {
    const [users] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return users[0];
  }
}

module.exports = UserModel;