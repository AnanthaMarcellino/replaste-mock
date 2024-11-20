const UserModel = require('../models/userModel');
const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../config/jwt');
const { sendEmail } = require('../config/email');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, full_name } = req.body;

      // Validasi input
      if (!email || !password || !full_name) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Simpan user
      const userId = await UserModel.create(email, hashedPassword, full_name);

      res.status(201).json({
        message: 'User berhasil didaftarkan',
        userId
      });

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' });
      }

      // Cari user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Verifikasi password
      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email });

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async requestReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email harus diisi' });
      }

      // Cari user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Email tidak terdaftar' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 jam
      
      // Log token yang akan diupdate
      console.log('Updating reset token for user:', {
        userId: user.id,
        resetToken,
        resetTokenExpiry
      });

      // Simpan token ke database
      const updated = await UserModel.updateResetToken(
            user.id,
            resetToken,
            resetTokenExpiry
      );

      // Verifikasi update berhasil
      if (!updated) {
        return res.status(500).json({ message: 'Gagal mengupdate reset token' });
      }

      // Verifikasi data setelah update
      const updatedUser = await UserModel.findById(user.id);
      console.log('User after update:', {
        id: updatedUser.id,
        email: updatedUser.email,
        resetToken: updatedUser.reset_token,
        resetTokenExpiry: updatedUser.reset_token_expiry
      });

      // Modifikasi email content untuk menampilkan token
      const emailHtml = `
        <h1>Reset Password</h1>
        <p>Anda menerima email ini karena Anda (atau seseorang) meminta reset password.</p>
        <p>Berikut adalah token reset password Anda:</p>
        <p style="background-color: #f0f0f0; padding: 10px; font-family: monospace; font-size: 14px;">
          ${resetToken}
        </p>
        <p>Gunakan token di atas untuk reset password Anda dengan cara:</p>
        <ol>
          <li>Buka endpoint: POST http://localhost:3000/password/reset/${resetToken}</li>
          <li>Kirim body JSON: { "password": "password_baru_anda" }</li>
        </ol>
        <p>Token ini akan kadaluarsa dalam 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      `;

      const emailSent = await sendEmail(
        email,
        'Reset Password Request',
        emailHtml
      );

      if (!emailSent) {
        return res.status(500).json({ message: 'Gagal mengirim email reset password' });
      }

      res.json({ 
        message: 'Email reset password telah dikirim',
        // Untuk keperluan testing, kita juga tampilkan token di response
        resetToken: resetToken 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async validateResetToken(req, res) {
    try {
      const { token } = req.params;

      const user = await UserModel.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
      }

      res.json({ message: 'Token valid' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'Password baru harus diisi' });
      }

      // Cari user berdasarkan token
      const user = await UserModel.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
      }

      // Hash password baru
      const hashedPassword = await hashPassword(password);

      // Update password
      await UserModel.updatePassword(user.id, hashedPassword);

      res.json({ message: 'Password berhasil direset' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
}

module.exports = AuthController;