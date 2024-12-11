
import mongoose from "mongoose";

const {Schema} = mongoose;
const sipReferenceSchema = new Schema({
    sipmember_clientid: { type: mongoose.Schema.ObjectId, required: true },
    sip_refered_by: { type: mongoose.Schema.ObjectId, required: true },
    sip_referedDate: { type: Date, required: true },
    comission_type: { type: String, required:true },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const sipReferenceModel = mongoose.model('sip_reference', sipReferenceSchema);

export default sipReferenceModel;