import express from 'express';
const sipManagementRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipMemberAction, createSipMemberReplicaByIdAction, DeleteSipMemberAction, getSipMemberByBranchIdAction, getSipMemberByClientIdAction, getSipMemberByIdAction, getSipMembersAction, ImportSipMemberUploadAction, UpdateSipMemberAction, verifyMemberUploadAction } from '../controllers/sipManagement.controller.js';


sipManagementRouter.post('/',Auth,createSipMemberAction);
sipManagementRouter.get('/:sip_id',Auth,getSipMemberByIdAction);
sipManagementRouter.get('/',Auth,getSipMembersAction);
sipManagementRouter.put('/:sip_id',Auth,UpdateSipMemberAction);
sipManagementRouter.delete('/:sip_id',Auth,DeleteSipMemberAction);
// sipManagementRouter.get('/:branch_id',Auth,deleteBranchAction); //search
sipManagementRouter.get('/all/:client_id',Auth,getSipMemberByClientIdAction); // Maturity
sipManagementRouter.get('/branch/:branch_id',Auth,getSipMemberByBranchIdAction); // lucky draw // sip Payment
sipManagementRouter.get('/replicate/:sip_id',Auth,createSipMemberReplicaByIdAction); 
sipManagementRouter.post('/verify-data',Auth,verifyMemberUploadAction); // sip_maturity // sip_Management
sipManagementRouter.post('/import-data',Auth,ImportSipMemberUploadAction);



export default sipManagementRouter;

// db.sip_member_mgmts.updateMany({},{$set:{sipmember_nominee_aadhaarno:null,sipmember_sip_category:null,sipmember_remarks:''}})

// db.sip_member_mgmts.updateMany({},{$set:{sipmember_remarks:''}})

// db.sip_member_mgmts.updateMany({},{$set:{sipmember_nominee_aadhaarno:"123456789012",sipmember_sip_category:ObjectId(6744a27b099547e85b3aca2c)}}) -- Not Required

// db.sip_member_mgmts.updateMany({},{$rename: { "sipmember_nominee_pancard": "sipmember_nominee_otherdocs" }});

// db.sip_member_mgmts.updateMany({}, [{$set: {sipmember_nominee_mobile: { $concat: ["+91-","$sipmember_nominee_mobile"] }}}])