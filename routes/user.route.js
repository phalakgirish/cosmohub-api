import express from 'express';
const userRouter = express.Router();
import Auth from '../env/auth.js';
import { createAllUsersByBranchIdAction, updateUsersAction, updateUsersChangePasswordAction, updateUsersPasswordAction } from '../controllers/user.controller.js';

userRouter.get('/:branch_id',Auth,createAllUsersByBranchIdAction);
userRouter.put('/all/:user_id',Auth,updateUsersAction);
userRouter.get('/changepassword/:user_id',Auth,updateUsersChangePasswordAction);
userRouter.put('/passwordchange/:user_id',Auth,updateUsersPasswordAction);


export default userRouter;