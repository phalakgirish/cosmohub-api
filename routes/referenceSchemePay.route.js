import express from 'express';
const referenceSchemePayRouter = express.Router();
import Auth from '../env/auth.js';
import { createReferenceSchemePaymentAction, deleteReferenceSchPaymentAction, getReferenceSchemePaymentAction, getReferenceSchemePaymentByIdAction, updateReferenceSchemePaymentAction } from '../controllers/referenceSchemePay.controller.js';

referenceSchemePayRouter.post('/',Auth,createReferenceSchemePaymentAction);
referenceSchemePayRouter.get('/:payment_id',Auth,getReferenceSchemePaymentByIdAction);
referenceSchemePayRouter.get('/',Auth,getReferenceSchemePaymentAction);
referenceSchemePayRouter.put('/:payment_id',Auth,updateReferenceSchemePaymentAction);
referenceSchemePayRouter.delete('/:payment_id',Auth,deleteReferenceSchPaymentAction);

// referenceSchemePayRouter.get('/:designation_id',Auth,deleteBranchAction); //search


export default referenceSchemePayRouter;