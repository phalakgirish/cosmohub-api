import express from 'express';
const designationRouter = express.Router();
import Auth from '../env/auth.js';
import { createDesignationAction, deleteDesignationAction, getAllDesignationAction, getDesignationAction, getDesignationByIdAction, updateDesignationAction } from '../controllers/designation.controller.js';



designationRouter.post('/',Auth,createDesignationAction);
designationRouter.get('/:designation_id',Auth,getDesignationByIdAction);
designationRouter.get('/',Auth,getDesignationAction);
designationRouter.put('/:designation_id',Auth,updateDesignationAction);
designationRouter.delete('/:designation_id',Auth,deleteDesignationAction);
designationRouter.get('/all/:department_id',Auth,getAllDesignationAction);
// designationRouter.get('/:designation_id',Auth,deleteBranchAction); //search


export default designationRouter;