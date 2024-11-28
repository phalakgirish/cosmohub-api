
import mongoose from "mongoose";

const {Schema} = mongoose;
const clientSchema = new Schema({
  client_id: { type: String, required: true },
  client_name: { type: String, required: true },
  client_dob: { type: Date, required: true },
  client_mobile_number: { type: String, required: true },
  client_emailId: { type: String, default: null },
  client_gender: { type: String, required:true },
  client_otherdocs: { type: String, default: null },
  client_addharcard: { type: String, default: null },
  client_aadhaar_number: { type: String, required: true },
  client_postaladdress: { type: String, required:true },
  client_landmark: { type: String, default: null },
  sip_refered_by_clientId: { type: mongoose.Schema.ObjectId, default: null },
  sip_reference_level: { type: Number },
  client_country: { type: String, default: null },
  client_state: { type: String, default: null },
  client_city: { type: String, default: null },
  client_status: { type: Boolean, required:true },
  branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const clientModel = mongoose.model('clients', clientSchema);

export default clientModel;
    