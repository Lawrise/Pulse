const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const user = await AuthService.register(username, email, password);
      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await AuthService.login(email, password);
      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AuthController;