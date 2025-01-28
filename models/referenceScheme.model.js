
import mongoose from "mongoose";

const {Schema} = mongoose;
const referenceSchemeSchema = new Schema({
  refScheme_name: { type: String, required: true },
  refScheme_category: { type: String, required: true },
  refScheme_amount: { type: Number, required: true },
  refScheme_comission: { type: String, required: true },
  refScheme_status: { type: Boolean, required: true },
});

const referenceSchemeModel = mongoose.model('reference_scheme', referenceSchemeSchema);

export default referenceSchemeModel;