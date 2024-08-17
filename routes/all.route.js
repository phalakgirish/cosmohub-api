import express from 'express';
const allRouter = express.Router();
import Auth from '../env/auth.js';
import { getClientsByBranchIdAction, getDepartmentByBranchIdAction, getDesignationByDepartmentIdAction, getSipMemberByBranchIdAction, getStaffByBranchIdAction, getUsersByBranchIdAction } from '../controllers/all.controller.js';


allRouter.get('/department/:branch_id',Auth,getDepartmentByBranchIdAction);
allRouter.get('/designation/:department_id',Auth,getDesignationByDepartmentIdAction);
allRouter.get('/client/:branch_id',Auth,getClientsByBranchIdAction);
allRouter.get('/uers/:branch_id', Auth, getUsersByBranchIdAction);
allRouter.get('/spimember/:branch_id', Auth, getSipMemberByBranchIdAction);
allRouter.get('/staff/:branch_id', Auth, getStaffByBranchIdAction);



export default allRouter;