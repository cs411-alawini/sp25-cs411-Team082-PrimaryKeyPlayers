import {Router, Request, Response} from 'express';

import {deletePlayer, addPlayer, getPlayerByName, getAllPlayers} from '../services/database';
import pool from '../services/connections';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const player_name = req.query.player_name as string;
    if (player_name) {
        const player = await getPlayerByName(player_name);
        res.json(player);
        return;
    } else {
        const players = await getAllPlayers();
        res.json(players);
    }
});

router.get('/by-team/:team_id', async (req: Request, res: Response) => {
    const { team_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM players WHERE team = ?', [team_id]);
    res.json(rows);
  });
  

router.post('/', async (req: Request, res: Response) => {
    const {player_name, position, team_id} = req.body;
    try {
        const result = await addPlayer(player_name, position, team_id);
        res.status(201).json({ message: 'User succcessfully added Player' , result});
    } catch (error) {
        res.status(500).json({ message: 'Error adding player' });
    }
});


router.delete('/:player_id', async (req: Request, res: Response) => {
    const playerId = parseInt(req.params.player_id);
    try {
        await deletePlayer(playerId);
        res.status(200).json({ message: 'User succcessfully deleted Player' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting player', error });
    }
});


export default router;