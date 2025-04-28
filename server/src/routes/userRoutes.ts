import {Router, Request, Response} from 'express';

import { addUserWithProcedure} from '../services/database';
import {addUser, getAllUsers, deleteUserById} from '../services/database';
import {user} from '../models/user';


const router = Router();

//get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Route to add a new user
router.post('/', async (req: Request, res: Response) => {
    const newUser: Omit<user, "user_id"> = req.body;
    try {
        await addUser(newUser);
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
});

router.delete('/:user_id', async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id);
    try {
        await deleteUserById(user_id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

//update user signup route
router.post('/stored', async (req: Request, res: Response) => {
    const {username, email,password} = req.body;
    try {
        await addUserWithProcedure(username,email,password);
        res.status(200).json({ message: 'User succcessfully added using stored procedure' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export default router;
