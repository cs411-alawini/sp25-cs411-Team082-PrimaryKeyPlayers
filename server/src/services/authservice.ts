import { Request, Response } from 'express';
import pool from './connections'; // your MySQL connection pool
import bcrypt from 'bcrypt'; // for password hashing

const SALT_ROUNDS = 10;

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err: any) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    return res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

