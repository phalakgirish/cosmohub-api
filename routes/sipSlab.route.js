import express from 'express';
const sipSlabRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipSlabAction, deleteSipSlabAction, getSipSlabAction, getSipSlabByIdAction, updateSipSlabAction } from '../controllers/sipSlab.controller.js';


sipSlabRouter.post('/',Auth,createSipSlabAction);
sipSlabRouter.get('/:slab_id',Auth,getSipSlabByIdAction);
sipSlabRouter.get('/',Auth,getSipSlabAction);
sipSlabRouter.put('/:slab_id',Auth,updateSipSlabAction);
sipSlabRouter.delete('/:slab_id',Auth,deleteSipSlabAction);
// sipSlabRouter.get('/:branch_id',Auth,deleteBranchAction); //search


export default sipSlabRouter;