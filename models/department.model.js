
import mongoose from "mongoose";

const {Schema} = mongoose;
const departmentSchema = new Schema({
    department_name: { type: String, required: true },
    branch_name: { type: mongoose.Schema.ObjectId, required:true },
    department_status: { type: Boolean, required: true },
});

const departmentModel = mongoose.model('departments', departmentSchema);

export default departmentModel;