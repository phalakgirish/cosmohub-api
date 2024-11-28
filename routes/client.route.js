import express from 'express';
const clientRouter = express.Router();
import Auth from '../env/auth.js';
import { createClientAction, DeleteClientAction, DeleteSelectedClientction, getClientAction, getClientByIdAction, getClientIdByBranchIdAction, ImportClientUploadAction, UpdateClientAction, verifyClientUploadAction } from '../controllers/client.controller.js';

clientRouter.post('/',Auth,createClientAction);
clientRouter.get('/:client_id',Auth,getClientByIdAction);
clientRouter.get('/',Auth,getClientAction);
clientRouter.put('/:client_id',Auth,UpdateClientAction);
clientRouter.delete('/:client_id',Auth,DeleteClientAction);
clientRouter.post('/selected',Auth,DeleteSelectedClientction);
clientRouter.get('/all/:branch_id',Auth,getClientIdByBranchIdAction); // sip_maturity // sip_Management
clientRouter.post('/verify-data',Auth,verifyClientUploadAction); // sip_maturity // sip_Management
clientRouter.post('/import-data',Auth,ImportClientUploadAction);

export default clientRouter;

// db.clients.updateMany({client_aadhaar_number:{$eq:null}},{$set:{client_aadhaar_number:null}})

// db.clients.updateMany({},{$set:{client_country:'India',client_state:'Maharashtra',client_city:''}})

// db.clients.updateMany({}, [{$set: {client_mobile_number: { $concat: ["+91-","$client_mobile_number"] }}}])

// db.clients.updateMany({},{$rename: { "client_pancard": "client_otherdocs" }});
