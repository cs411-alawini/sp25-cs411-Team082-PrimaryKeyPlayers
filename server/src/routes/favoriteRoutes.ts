import {Router, Request, Response} from 'express';

import {addFavorite, getFavoriteTeams, getFavoritePlayers, removeFavorite} from '../services/database';

const router = Router();

// Route to add a new favorite
router.post('/', async (req: Request, res: Response) => {
    const { user_id, favorite_id, favorite_type } = req.body;
    try {
        const newFavorite = await addFavorite(user_id, favorite_id, favorite_type);
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite', error });
    }
});

// Route to get favorite teams
router.get('/teams/:user_id', async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id);
    try {
        const teams = await getFavoriteTeams(user_id);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorite teams', error });
    }
});
// Route to get favorite players
router.get('/players/:user_id', async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id);
    try {
        const players = await getFavoritePlayers(user_id);
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorite players', error });
    }
});

// Remove a favorite
router.delete('/:favorite_id', async (req: Request, res: Response) => {
    const favorite_id = parseInt(req.params.favorite_id);
    try {
        await removeFavorite(favorite_id);
        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error });
    }
});

export default router;

