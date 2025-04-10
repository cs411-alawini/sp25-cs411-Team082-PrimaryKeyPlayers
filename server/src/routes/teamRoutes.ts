import {Router, Request, Response} from 'express';
import {getAllTeams, getTeamById, getTeamByName} from '../services/database';

import {Teams} from '../models/teams';

const router = Router();

router.get('/' , async (req: Request, res: Response) => {
    const team_name = req.query.team_name as string;
    if (team_name) {
        const team = await getTeamByName(team_name);
        res.json(team);
        return;
    } else {
        const teams = await getAllTeams();
        res.json(teams);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const team = await getTeamById(id.toUpperCase());
        if (team) {
            res.status(200).json(team);
        } else {
            res.status(404).json({ message: "Team not found" });
        } 
    } catch (error) {
        console.error("Error fetching team:", error);
    }
});


export default router;
