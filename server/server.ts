import express, {Request,Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import playerRoutes from './src/routes/playerRoutes';
import teamRoutes from './src/routes/teamRoutes';
import favoriteRoutes from './src/routes/favoriteRoutes';
import authroutes from './src/routes/authroutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/favorites',favoriteRoutes);
app.get('/api/health', (_req: Request, res:Response) => {res.json({status:'ok'})});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API is listening on ${PORT}`));
// app.use('/api/auth', authroutes); 
