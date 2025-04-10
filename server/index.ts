import express, { Request, Response } from 'express';
import teamRoutes from './src/routes/teamRoutes';
import playerRoutes from './src/routes/playerRoutes';
import userRoutes from './src/routes/userRoutes';
import favoriteRoutes from './src/routes/favoriteRoutes';

const app = express();
const PORT = 3007;

app.use(express.json());

app.get('/api/', (req: Request, res: Response) => {
  res.send('API of NBA data');
});

app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});