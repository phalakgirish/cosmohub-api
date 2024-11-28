
import mongoose from "mongoose";

const {Schema} = mongoose;
const sipCategorySchema = new Schema({
  sipcategory_name: { type: String, required: true },
  sipcategory_status: { type: Boolean, required: true },
});

const sipCategoryModel = mongoose.model('sip_category', sipCategorySchema);

export default sipCategoryModel;