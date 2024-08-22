
import mongoose from "mongoose";

const {Schema} = mongoose;
const branchSchema = new Schema({
    branch_code: {type: String, required: true},
    branch_name: {type: String, required: true},
    branch_contact_person: { type: String, required: true },
    branch_mobile_number: { type: String, required: true },
    branch_emailId: { type: String, required: true },
    branch_area: { type: String, required: true },
    branch_city: { type: String, required: true },
    branch_district: { type: String, required: true },
    branch_taluka: { type: String, required: true },
    branch_pincode:{ type: String, required: true },
    branch_state: {type: String, required:true },
    branch_status: { type: Boolean, required: true }
});

const branchModel = mongoose.model('branch', branchSchema);

export default branchModel;
    