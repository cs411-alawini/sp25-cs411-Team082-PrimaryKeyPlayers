import express, {Request,Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import playerRoutes from './routes/playerRoutes';
import teamRoutest from './routes/teamRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutest);
app.use('/api/favories',favoriteRoutes);
app.get('/api/health', (_req: Request, res:Response) => {res.json({status:'ok'})});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API is listening on ${PORT}`));
