import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { supabase } from './models.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register
router.post('/register',
  body('username').isEmail().withMessage('Username must be a valid email'),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    if (existingUser) return res.status(400).json({ error: 'User exists' });
    const hash = bcrypt.hashSync(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password: hash }])
      .select('id, username')
      .single();
    if (error) return res.status(500).json({ error: 'DB error' });
    const token = jwt.sign({ id: data.id, username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  }
);

// Login
router.post('/login',
  body('username').isEmail().withMessage('Username must be a valid email'),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const { data: user } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('username', username)
      .single();
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  }
);

export default router;
