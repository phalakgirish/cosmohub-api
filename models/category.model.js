
import mongoose from "mongoose";

const {Schema} = mongoose;
const categorySchema = new Schema({
  category_name: { type: String, required: true },
  category_status: { type: Boolean, required: true },
});

const categoryModel = mongoose.model('category', categorySchema);

export default categoryModel;