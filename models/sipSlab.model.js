
import mongoose from "mongoose";

const {Schema} = mongoose;
const sipSlabSchema = new Schema({
    sip_slab_from: { type: Number, required: true },
    sip_slab_to: { type: Number, required: true },
    sip_rank: {type: String, required:true },
    sip_amount: {type: Number, required:true },
    sip_type: { type: String, required:true },
    sip_status: { type: String, required: true },
    // branch_id:{ type: mongoose.Schema.ObjectId, required:true }

});

const sipSlabModel = mongoose.model('sip_slabs', sipSlabSchema);

export default sipSlabModel;