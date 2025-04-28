import { Router } from 'express';
import { createUser, loginUser } from '../services/authservice';

const router = Router();

// Route to create a new user
router.post('/signup', async (req, res) => {
  await createUser(req, res);
});

// Route to log in a user
router.post('/login', async (req, res) => {
  await loginUser(req, res);
});

export default router;