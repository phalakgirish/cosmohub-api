import mongoose from "mongoose";

const {Schema} = mongoose;

const sipMemberMgmtSchema = new Schema({
  sipmember_id: { type: String },
  client_id: { type: String },
  sipmember_name: { type: String },
  sipmember_bank_name: { type: String },
  sipmember_account_number: { type: String },
  sipmember_ifsc_code: { type: String },
  sipmember_upi_id: { type: String },
  sipmember_doj: { type: Date },
  sipmember_maturity_date: { type: Date },
  sipmember_nominee_name: { type: String },
  sipmember_nominee_age: { type: Number },
  sipmember_nominee_relation: { type: String },
  sipmember_nominee_mobile: { type: String },
  sipmember_nominee_pancard: { type: String },
  sipmember_nominee_addharcard: { type: String },
  sipmemberblock_status: {type: Boolean },
  branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const sipMemberMgmtModel = mongoose.model('sip_member_mgmt', sipMemberMgmtSchema);

export default sipMemberMgmtModel;
    