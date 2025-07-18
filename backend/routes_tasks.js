import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from './models.js';
import { authenticateToken } from './middleware.js';

const router = express.Router();

// Get all tasks for user
router.get('/', authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: 'DB error' });
  res.json(data);
});

// Create task
router.post('/', authenticateToken,
  body('title').isLength({ min: 1 }),
  body('status').isIn(['pending', 'in-progress', 'done']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, status, extras } = req.body;
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: req.user.id, title, description, status, extras }])
      .select('*')
      .single();
    if (error) return res.status(500).json({ error: 'DB error' });
    res.json(data);
  }
);

// Update task
router.put('/:id', authenticateToken,
  body('title').optional().isLength({ min: 1 }),
  body('status').optional().isIn(['pending', 'in-progress', 'done']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, status, extras } = req.body;
    const { data, error } = await supabase
      .from('tasks')
      .update({ title, description, status, extras })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('*')
      .single();
    if (error) return res.status(500).json({ error: 'DB error' });
    res.json(data);
  }
);

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: 'DB error' });
  res.json({ deleted: true });
});

// Insights endpoint
router.get('/insights', authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('status')
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: 'DB error' });
  const total = data.length;
  const statusCount = { pending: 0, 'in-progress': 0, done: 0 };
  data.forEach(task => { statusCount[task.status] = (statusCount[task.status] || 0) + 1; });
  res.json({ total, ...statusCount });
});

export default router;
