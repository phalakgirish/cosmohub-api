
import mongoose from "mongoose";

const {Schema} = mongoose;
const sipSlabSchema = new Schema({
    sip_slab_from: { type: Number, required: true },
    sip_slab_to: { type: Number, required: true },
    sip_slab_status: { type: Boolean, required: true },
    sip_slab_details: { type: Array, required: true },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }

});

const sipSlabModel = mongoose.model('sip_slabs', sipSlabSchema);

export default sipSlabModel;