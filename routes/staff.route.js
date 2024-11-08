import express from 'express';
const staffRouter = express.Router();
import { DeleteStaffAction, UpdateStaffAction, createStaffAction ,getStaffByIdAction, getStaffsAction} from '../controllers/staff.controller.js';
import Auth from '../env/auth.js';

staffRouter.post('/',Auth,createStaffAction);
staffRouter.get('/:staff_id',Auth,getStaffByIdAction);
staffRouter.get('/',Auth,getStaffsAction);
staffRouter.put('/:staff_id',Auth,UpdateStaffAction);
staffRouter.delete('/:staff_id',Auth,DeleteStaffAction);


export default staffRouter;