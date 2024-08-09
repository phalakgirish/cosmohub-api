import express from 'express';
const departmentRouter = express.Router();
import Auth from '../env/auth.js';
import { createDepartmentAction, deleteDepartmentAction, getAllDepartmentAction, getDepartmentAction, getDepartmentByIdAction, updateDepartmentAction } from '../controllers/department.controller.js';


departmentRouter.post('/',Auth,createDepartmentAction);
departmentRouter.get('/:department_id',Auth,getDepartmentByIdAction);
departmentRouter.get('/',Auth,getDepartmentAction);
departmentRouter.put('/:department_id',Auth,updateDepartmentAction);
departmentRouter.delete('/:department_id',Auth,deleteDepartmentAction);
departmentRouter.get('/all/:branch_id',Auth,getAllDepartmentAction);

// departmentRouter.get('/:department_id',Auth,deleteBranchAction); //search


export default departmentRouter;