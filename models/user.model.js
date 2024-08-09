
import mongoose from "mongoose";

const {Schema} = mongoose;
const userSchema = new Schema({
  user_emailId: { type: String, required: true },
  user_password: { type: String, required: true },
  user_role_type: { type: String, required: true },
  staff_id: { type: mongoose.Schema.ObjectId, required:true },
  user_status: {type: Boolean, required:true}
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
    