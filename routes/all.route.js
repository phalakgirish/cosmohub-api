import express from 'express';
const allRouter = express.Router();
import Auth from '../env/auth.js';
import { getClientsByBranchIdAction, getDepartmentByBranchIdAction, getDesignationByDepartmentIdAction, getUsersByBranchIdAction } from '../controllers/all.controller.js';


allRouter.get('/department/:branch_id',Auth,getDepartmentByBranchIdAction);
allRouter.get('/designation/:department_id',Auth,getDesignationByDepartmentIdAction);
allRouter.get('/client/:branch_id',Auth,getClientsByBranchIdAction);
allRouter.get('/uers/:branch_id', Auth, getUsersByBranchIdAction);


export default allRouter;