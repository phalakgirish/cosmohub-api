import express from 'express';
const staffRouter = express.Router();
import { DeleteStaffAction, UpdateStaffAction, VerifyEmailAction, createStaffAction ,getStaffByIdAction, getStaffsAction} from '../controllers/staff.controller.js';
import Auth from '../env/auth.js';

staffRouter.post('/',Auth,createStaffAction);
staffRouter.get('/:staff_id',Auth,getStaffByIdAction);
staffRouter.get('/',Auth,getStaffsAction);
staffRouter.put('/:staff_id',Auth,UpdateStaffAction);
staffRouter.delete('/:staff_id',Auth,DeleteStaffAction);
staffRouter.get('/verify/:emailid',Auth,VerifyEmailAction);


// db.staffs.updateMany({},{$set:{staff_country:'India',staff_state:'Maharashtra',staff_isemailVerified:false}})

// db.staffs.updateMany({},{$set:{staff_isemailVerified:false}}) -- Not Required


// db.staffs.updateMany({}, [{$set: {staff_mobile_number: { $concat: ["+91-","$staff_mobile_number"] }}}])



export default staffRouter;