
import mongoose from "mongoose";

const {Schema} = mongoose;
const clientSchema = new Schema({
  client_id: { type: String, required: true },
  client_name: { type: String, required: true },
  client_dob: { type: Date, required: true },
  client_mobile_number: { type: String, required: true },
  client_emailId: { type: String, required: true },
  client_gender: { type: String, required:true },
  client_pancard: { type: String, required:true },
  client_addharcard: { type: String, required:true },
  branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const clientModel = mongoose.model('clients', clientSchema);

export default clientModel;
    