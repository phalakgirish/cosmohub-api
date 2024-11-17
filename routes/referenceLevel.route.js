import express from 'express';
const referenceLevelRouter = express.Router();
import Auth from '../env/auth.js';
import { createReferenceLevelAction, deleteReferenceLevelAction, getReferenceLevelAction, getReferenceLevelByIdAction, updateReferenceLevelAction } from '../controllers/refenceLevel.controller.js';



referenceLevelRouter.post('/',Auth,createReferenceLevelAction);
referenceLevelRouter.get('/:reference_id',Auth,getReferenceLevelByIdAction);
referenceLevelRouter.get('/',Auth,getReferenceLevelAction);
referenceLevelRouter.put('/:reference_id',Auth,updateReferenceLevelAction);
referenceLevelRouter.delete('/:reference_id',Auth,deleteReferenceLevelAction);
// referenceLevelRouter.get('/:branch_id',Auth,deleteBranchAction); //search


export default referenceLevelRouter;