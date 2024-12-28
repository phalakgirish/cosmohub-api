
import mongoose from "mongoose";

const {Schema} = mongoose;
const clientWalletSchema = new Schema({
    client_id: { type: mongoose.Schema.ObjectId, required: true },
    wallet_trans_date: { type: Date, required: true },
    wallet_trans_type: {type: String, default: null },
    wallet_trans_desc: { type: String, required: true },
    wallet_credit: { type: Number, required: true },
    wallet_debit: { type: Number, required: true },
    wallet_balance: { type: Number, required: true },
});

const cilentWalletModel = mongoose.model('client_Wallet', clientWalletSchema);

export default cilentWalletModel;