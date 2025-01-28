
import mongoose from "mongoose";

const {Schema} = mongoose;
const referenceSchemePaymentSchema = new Schema({
    refschpayment_receiptno: { type: String, required: true },
    client_id: { type: mongoose.Schema.ObjectId, required: true },
    client_name: { type: String },
    reference_category: { type: String },
    reference_scheme: { type: mongoose.Schema.ObjectId, required: true },
    reference_scheme_amount: { type: Number, required: true },
    ref_payment_mode: { type: String, required: true },
    ref_payment_refno: { type: String },
    ref_payment_receivedBy: { type: mongoose.Schema.ObjectId, required: true },
    ref_payment_receivedDate: { type: Date, required: true },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }

});

const referenceSchemePaymentModel = mongoose.model('reference_scheme_payment', referenceSchemePaymentSchema);

export default referenceSchemePaymentModel;

// db["reference_scheme_payments"].updateMany({reference_scheme_amount:10000},{$set:{reference_scheme:ObjectId("678d2591073ee50e84a795d6")}})

// db["reference_scheme_payments"].updateMany({reference_scheme_amount:5000},{$set:{reference_scheme:ObjectId("678d257e073ee50e84a795d1")}})

// db["reference_scheme_payments"].updateMany({reference_scheme_amount:1000},{$set:{reference_scheme:ObjectId("678d2545073ee50e84a795cc")}})

// db["reference_scheme_payments"].updateMany({},{$set:{reference_category:"SIP"}})