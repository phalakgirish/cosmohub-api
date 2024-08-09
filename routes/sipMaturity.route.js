import express from 'express';
const sipMaturityRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipMaturityAction, deleteSipMaturityAction, getSipMaturityAction, getSipMaturityByIdAction, updateSipMaturityAction } from '../controllers/sipMaturity.controller.js';


sipMaturityRouter.post('/',Auth,createSipMaturityAction);
sipMaturityRouter.get('/:payment_id',Auth,getSipMaturityByIdAction);
sipMaturityRouter.get('/',Auth,getSipMaturityAction);
sipMaturityRouter.put('/:payment_id',Auth,updateSipMaturityAction);
sipMaturityRouter.delete('/:payment_id',Auth,deleteSipMaturityAction);


// sipMaturityRouter.get('/:designation_id',Auth,deleteBranchAction); //search


export default sipMaturityRouter;