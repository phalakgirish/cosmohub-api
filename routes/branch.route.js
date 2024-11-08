import express from 'express';
const branchRouter = express.Router();
import Auth from '../env/auth.js';
import { createBranchAction, deleteBranchAction, getAllBranchAction, getBranchAction, getBranchByIdAction, updateBranchAction } from '../controllers/branch.controller.js';

branchRouter.post('/',Auth,createBranchAction);
branchRouter.get('/:branch_id',Auth,getBranchByIdAction);
branchRouter.get('/',Auth,getBranchAction);
branchRouter.put('/:branch_id',Auth,updateBranchAction);
branchRouter.delete('/:branch_id',Auth,deleteBranchAction);
branchRouter.get('/all/:all',Auth,getAllBranchAction);

// branchRouter.get('/:branch_id',Auth,deleteBranchAction); //search


export default branchRouter;