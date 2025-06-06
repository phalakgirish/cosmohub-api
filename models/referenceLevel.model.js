
import mongoose from "mongoose";

const {Schema} = mongoose;
const referenceLevelSchema = new Schema({
    reference_level: { type: Number, required: true },
    reference_category:{ type: String, required: true},
    reference_bouns: { type: Number, required: true },
    reference_effective: { type: Date, required: true },
    reference_status: { type: Boolean, required: true },

});

const referenceLevelModel = mongoose.model('reference_level', referenceLevelSchema);

export default referenceLevelModel;