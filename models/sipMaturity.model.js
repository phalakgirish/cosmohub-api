
import mongoose from "mongoose";

const {Schema} = mongoose;
const sipMaturitySchema = new Schema({
    sipmaturity_receiptno: { type: String },
    client_id: { type: mongoose.Schema.ObjectId, required: true },
    sipmember_id: { type: mongoose.Schema.ObjectId, required: true },
    sipmember_name: { type: String, required: true },
    sip_maturity_amount: { type: Number, required:true },
    sip_payment_mode: { type: String, required: true },
    sip_payment_receivedBy: { type: mongoose.Schema.ObjectId, required: true },
    sip_payment_receivedDate: { type: Date, required: true },
    sip_maturity_doc: { type: String },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const sipMaturityModel = mongoose.model('sip_maturity', sipMaturitySchema);

export default sipMaturityModel;