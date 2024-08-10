import express from 'express';
const allRouter = express.Router();
import Auth from '../env/auth.js';
import { getDepartmentByBranchIdAction, getDesignationByDepartmentIdAction } from '../controllers/all.controller.js';


allRouter.get('/department/:branch_id',Auth,getDepartmentByBranchIdAction);
allRouter.get('/designation/:department_id',Auth,getDesignationByDepartmentIdAction);


export default allRouter;