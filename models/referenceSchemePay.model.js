
import mongoose from "mongoose";

const {Schema} = mongoose;
const referenceSchemePaymentSchema = new Schema({
    refschpayment_receiptno: { type: String, required: true },
    client_id: { type: mongoose.Schema.ObjectId, required: true },
    client_name: { type: String },
    // reference_scheme_category: { type: mongoose.Schema.ObjectId },
    reference_scheme_amount: { type: Number, required: true },
    ref_payment_mode: { type: String, required: true },
    ref_payment_refno: { type: String },
    ref_payment_receivedBy: { type: mongoose.Schema.ObjectId, required: true },
    ref_payment_receivedDate: { type: Date, required: true },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }

});

const referenceSchemePaymentModel = mongoose.model('reference_scheme_payment', referenceSchemePaymentSchema);

export default referenceSchemePaymentModel;