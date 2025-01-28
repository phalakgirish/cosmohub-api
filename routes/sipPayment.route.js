import express from 'express';
const sipPaymentRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipPaymentAction, deleteSipPaymentAction, getClientWalletBalance, getPenaltyAmountBySIPMemberIdction, getSipPaymentAction, getSipPaymentByIdAction, getSipPaymentPreeventcheck, SIPDataClearAction, SIPPaymentCorrectionAction, updateSipPaymentAction } from '../controllers/sipPayment.controller.js';


sipPaymentRouter.post('/',Auth,createSipPaymentAction);
sipPaymentRouter.get('/:payment_id',Auth,getSipPaymentByIdAction);
sipPaymentRouter.get('/',Auth,getSipPaymentAction);
sipPaymentRouter.put('/:payment_id',Auth,updateSipPaymentAction);
sipPaymentRouter.delete('/:payment_id',Auth,deleteSipPaymentAction);
sipPaymentRouter.post('/penaltyamt/',Auth,getPenaltyAmountBySIPMemberIdction);
sipPaymentRouter.get('/wallet/:member_id',Auth,getClientWalletBalance);
sipPaymentRouter.get('/pre/paymentprev',Auth,getSipPaymentPreeventcheck);
sipPaymentRouter.get('/all/correction',SIPPaymentCorrectionAction);
sipPaymentRouter.get('/delete/data',SIPDataClearAction);






// sipPaymentRouter.get('/:designation_id',Auth,deleteBranchAction); //search


export default sipPaymentRouter;