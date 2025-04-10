import {Router, Request, Response} from 'express';

import {getPlayerByName, getAllPlayers} from '../services/database';

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


export default router;