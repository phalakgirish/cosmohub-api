import express from 'express';
const clientRouter = express.Router();
import Auth from '../env/auth.js';
import { clientDataCorrect, createClientAction, DeleteClientAction, DeleteSelectedClientction, getClientAction, getClientByIdAction, getClientIdByBranchIdAction, ImportClientUploadAction, UpdateClientAction, updateCreatedDate, VerifiedAddDuplicateClient, verifyClientUploadAction } from '../controllers/client.controller.js';

clientRouter.post('/',Auth,createClientAction);
clientRouter.get('/:client_id',Auth,getClientByIdAction);
clientRouter.get('/',Auth,getClientAction);
clientRouter.put('/:client_id',Auth,UpdateClientAction);
clientRouter.delete('/:client_id',Auth,DeleteClientAction);
clientRouter.post('/selected',Auth,DeleteSelectedClientction);
clientRouter.get('/all/:branch_id',Auth,getClientIdByBranchIdAction); // sip_maturity // sip_Management
clientRouter.post('/verify-data',Auth,verifyClientUploadAction); // sip_maturity // sip_Management
clientRouter.post('/import-data',Auth,ImportClientUploadAction);
clientRouter.get('/verify/client',Auth,VerifiedAddDuplicateClient);
clientRouter.get('/update/createdAt',updateCreatedDate);
clientRouter.get('/update/createdAt',updateCreatedDate);
clientRouter.get('/reference/correction',clientDataCorrect)



export default clientRouter;

// db.clients.updateMany({client_aadhaar_number:{$eq:null}},{$set:{client_aadhaar_number:null}})

// db.clients.updateMany({},{$set:{client_country:'India',client_state:'Maharashtra',client_city:''}})

// db.clients.updateMany({}, [{$set: {client_mobile_number: { $concat: ["+91-","$client_mobile_number"] }}}])

// db.clients.updateMany({},{$rename: { "client_pancard": "client_otherdocs" }});

// db.clients.updateMany({},{$set:{client_sip_refrence_family:false}})

// db.clients.updateMany({},{$set:{sip_reference_level:0}})

// sip_reference "681c6b039c1788b92170ce7a"
// payment_id "6718ac3aeacfd86c7470707f"


// shailendra sant's "670f679238f3dad7f7ffb6c3"

