
import mongoose from "mongoose";

const {Schema} = mongoose;
const sipPaymentSchema = new Schema({
    sippayment_receiptno: { type: String, required: true },
    sipmember_id: { type: mongoose.Schema.ObjectId, required: true },
    sipmember_name: { type: String, required: true },
    sip_payment_month: { type: String, required: true },
    sip_amount: { type: Number, required: true },
    sip_penalty_month: { type: String },
    sip_penalty_amount: { type: Number },
    sip_payment_mode: { type: String },
    sip_payment_refno: { type: String },
    sip_payment_receivedBy: { type: mongoose.Schema.ObjectId, required: true },
    sip_payment_receivedDate: { type: Date, required: true },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const sipPaymentModel = mongoose.model('sip_payments', sipPaymentSchema);

export default sipPaymentModel;