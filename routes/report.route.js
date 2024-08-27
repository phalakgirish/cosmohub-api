import express from 'express';
const reportRouter = express.Router();
import Auth from '../env/auth.js';
import { getMonthWisePaymentAction, getSIPMemberWisePaymentAction } from '../controllers/report.controller.js';

reportRouter.get('/payment',Auth,getMonthWisePaymentAction);
reportRouter.get('/member-payment',Auth,getSIPMemberWisePaymentAction);


export default reportRouter;