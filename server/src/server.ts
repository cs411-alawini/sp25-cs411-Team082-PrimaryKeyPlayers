import express, {Request,Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import playerRoutes from './routes/playerRoutes';
import teamRoutes from './routes/teamRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import userRoutes from './routes/userRoutes';
import authroutes from './routes/authroutes';

const app = express();
app.use(cors({
    origin: 'http://localhost:3001',
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/favorites',favoriteRoutes);
app.use('/api/users',userRoutes);
app.get('/api/health', (_req: Request, res:Response) => {res.json({status:'ok'})});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API is listening on ${PORT}`));