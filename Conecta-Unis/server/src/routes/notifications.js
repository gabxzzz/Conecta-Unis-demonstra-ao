import { Router } from 'express';
import { mutate, readDb } from '../db.js';
import { authRequired } from '../auth.js';
import { sortNewest } from '../utils.js';

const router = Router();

router.get('/', authRequired, (req, res) => {
  const db = readDb();
  const list = sortNewest(db.notifications.filter((n) => n.userId === req.user.id));
  res.json(list);
});

router.post('/read-all', authRequired, (req, res) => {
  const updated = mutate((db) => {
    let count = 0;
    for (const notification of db.notifications) {
      if (notification.userId === req.user.id && !notification.read) {
        notification.read = true;
        count += 1;
      }
    }
    return count;
  });
  res.json({ updated });
});

router.patch('/:id/read', authRequired, (req, res) => {
  const updated = mutate((db) => {
    const notification = db.notifications.find(
      (n) => n.id === req.params.id && n.userId === req.user.id
    );
    if (!notification) return null;
    notification.read = true;
    return notification;
  });
  if (!updated) return res.status(404).json({ message: 'Notificação não encontrada.' });
  res.json(updated);
});

export default router;
