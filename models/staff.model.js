
import mongoose from "mongoose";

const {Schema} = mongoose;
const staffSchema = new Schema({
  staff_id: { type: String, required: true },
  staff_name: { type: String, required: true },
  staff_dob: { type: Date, required: true },
  staff_mobile_number: { type: String, required: true },
  staff_emailId: { type: String, required: true },
  staff_gender: { type: String, required:true },
  staff_pancard: { type: String, required:true },
  staff_addharcard: { type: String, required:true },
  staff_department: { type: mongoose.Schema.ObjectId, required:true },
  staff_designation: { type: mongoose.Schema.ObjectId, required:true },
  staff_branch: { type: mongoose.Schema.ObjectId, required:true },
  staff_doj: { type: Date, required: true },
  staff_role_type: { type: String, required: true },
});

const staffModel = mongoose.model('staffs', staffSchema);

export default staffModel;
    