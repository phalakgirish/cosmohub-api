import express from 'express';
const clientRouter = express.Router();
import Auth from '../env/auth.js';
import { createClientAction, DeleteClientAction, getClientAction, getClientByIdAction, getClientIdByBranchIdAction, UpdateClientAction } from '../controllers/client.controller.js';

clientRouter.post('/',Auth,createClientAction);
clientRouter.get('/:client_id',Auth,getClientByIdAction);
clientRouter.get('/',Auth,getClientAction);
clientRouter.put('/:client_id',Auth,UpdateClientAction);
clientRouter.delete('/:client_id',Auth,DeleteClientAction);
clientRouter.get('/all/:branch_id',Auth,getClientIdByBranchIdAction); // sip_maturity // sip_Management

export default clientRouter;