import express from 'express';
const reportRouter = express.Router();
import Auth from '../env/auth.js';
import { getMonthWisePaymentAction, getSIPMemberDetailsAction, getSIPMemberWisePaymentAction } from '../controllers/report.controller.js';

reportRouter.get('/payment',Auth,getMonthWisePaymentAction);
reportRouter.get('/member-payment',Auth,getSIPMemberWisePaymentAction);
reportRouter.get('/sip_members',Auth,getSIPMemberDetailsAction);



export default reportRouter;