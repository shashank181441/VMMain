import express from 'express';
import {
    createUser,
    updateUser,
    getUserDetails,
    getAllUsers,
    deleteUser
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', createUser);
router.put('/:userId', updateUser);
router.get('/:userId', getUserDetails);
router.get('/', getAllUsers);
router.delete('/:userId', deleteUser);

export default router;
