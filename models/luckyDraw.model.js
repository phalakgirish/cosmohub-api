
import mongoose from "mongoose";

const {Schema} = mongoose;
const luckyDrawSchema = new Schema({
    luckydraw_month: {type: String, required: true},
    spimember_id: { type: mongoose.Schema.ObjectId, required: true },
    luckydraw_rank: { type: Number, required: true },
    ispaymentdone: { type: Boolean },
    branch_id:{ type: mongoose.Schema.ObjectId, required:true }
});

const luckyDrawModel = mongoose.model('spi_luckdraw', luckyDrawSchema);

export default luckyDrawModel;