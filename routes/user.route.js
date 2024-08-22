import express from 'express';
const userRouter = express.Router();
import Auth from '../env/auth.js';
import { createAllUsersByBranchIdAction, updateUsersAction } from '../controllers/user.controller.js';

userRouter.get('/:branch_id',Auth,createAllUsersByBranchIdAction);
userRouter.put('/all/:user_id',Auth,updateUsersAction);


export default userRouter;