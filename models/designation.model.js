
import mongoose from "mongoose";

const {Schema} = mongoose;
const designationSchema = new Schema({
    designation_name: { type: String, required: true },
    department_name: { type: mongoose.Schema.ObjectId, required:true },
    designation_status: { type: Boolean, required: true }
});

const designationModel = mongoose.model('designations', designationSchema);

export default designationModel;