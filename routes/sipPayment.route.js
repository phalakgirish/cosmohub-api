import express from 'express';
const sipPaymentRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipPaymentAction, deleteSipPaymentAction, getPenaltyAmountBySIPMemberIdction, getSipPaymentAction, getSipPaymentByIdAction, updateSipPaymentAction } from '../controllers/sipPayment.controller.js';


sipPaymentRouter.post('/',Auth,createSipPaymentAction);
sipPaymentRouter.get('/:payment_id',Auth,getSipPaymentByIdAction);
sipPaymentRouter.get('/',Auth,getSipPaymentAction);
sipPaymentRouter.put('/:payment_id',Auth,updateSipPaymentAction);
sipPaymentRouter.delete('/:payment_id',Auth,deleteSipPaymentAction);
sipPaymentRouter.post('/penaltyamt/',Auth,getPenaltyAmountBySIPMemberIdction);

// sipPaymentRouter.get('/:designation_id',Auth,deleteBranchAction); //search


export default sipPaymentRouter;