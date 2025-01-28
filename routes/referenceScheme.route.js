import express from 'express';
const referenceSchemeRouter = express.Router();
import Auth from '../env/auth.js';
import { createRefenrenceSchemeAction, deleteReferenceSchemeAction, getReferenceSchemeAction, getReferenceSchemeByCategory, getReferenceSchemeByIdAction, updateReferenceSchemeAction } from '../controllers/referenceScheme.controller.js';


referenceSchemeRouter.post('/',Auth,createRefenrenceSchemeAction);
referenceSchemeRouter.get('/:refScheme_id',Auth,getReferenceSchemeByIdAction);
referenceSchemeRouter.get('/',Auth,getReferenceSchemeAction);
referenceSchemeRouter.put('/:refScheme_id',Auth,updateReferenceSchemeAction);
referenceSchemeRouter.get('/category/:category',Auth,getReferenceSchemeByCategory);
referenceSchemeRouter.delete('/:refScheme_id',Auth,deleteReferenceSchemeAction);


export default referenceSchemeRouter;