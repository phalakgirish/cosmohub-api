import express from 'express';
const sipManagementRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipMemberAction, createSipMemberReplicaByIdAction, DeleteSipMemberAction, getSipMemberByBranchIdAction, getSipMemberByClientIdAction, getSipMemberByIdAction, getSipMembersAction, UpdateSipMemberAction } from '../controllers/sipManagement.controller.js';


sipManagementRouter.post('/',Auth,createSipMemberAction);
sipManagementRouter.get('/:sip_id',Auth,getSipMemberByIdAction);
sipManagementRouter.get('/',Auth,getSipMembersAction);
sipManagementRouter.put('/:sip_id',Auth,UpdateSipMemberAction);
sipManagementRouter.delete('/:sip_id',Auth,DeleteSipMemberAction);
// sipManagementRouter.get('/:branch_id',Auth,deleteBranchAction); //search
sipManagementRouter.get('/all/:client_id',Auth,getSipMemberByClientIdAction); // Maturity
sipManagementRouter.get('/branch/:branch_id',Auth,getSipMemberByBranchIdAction); // lucky draw // sip Payment
sipManagementRouter.get('/replicate/:sip_id',Auth,createSipMemberReplicaByIdAction); 



export default sipManagementRouter;