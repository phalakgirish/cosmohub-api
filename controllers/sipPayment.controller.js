import mongoose from "mongoose";
import sipPaymentModel from "../models/sipPayment.model.js";


const ObjectId = mongoose.Types.ObjectId;

export const createSipPaymentAction = async (req, res) => {
    const{sipmember_id, sipmember_name, sip_payment_month, sip_amount, sip_penalty_month, sip_penalty_amount, sip_payment_mode, sip_payment_refno, sip_payment_receivedBy, sip_payment_receivedDate,branch_id} = req.body;   
    try {

        var sipPaymentDetails = await sipPaymentModel.find();

                let ActualNo = 0
                let NewReceipt_No = ''
                if(sipPaymentDetails.length > 0)
                {
                    for(let val of sipPaymentDetails)
                    {
                        const splitNumbers = val.sippayment_receiptno.split('-').map((num) => parseFloat(num.trim()));
                        // console.log(splitNumbers);
                        if(splitNumbers[1] > ActualNo)
                        {
                            ActualNo = splitNumbers[1];
                        }
                    }
                }

                if(ActualNo == 0)
                {
                    ActualNo = 1001;
                    NewReceipt_No = 'SIPR-'+ActualNo.toString()
                }
                else
                {
                    ActualNo = ActualNo+1;
                    NewReceipt_No = 'SIPR-'+ActualNo.toString()
                }

        var DataToSave = {
            sippayment_receiptno: NewReceipt_No,
            sipmember_id: sipmember_id,
            sipmember_name: sipmember_name,
            sip_payment_month: sip_payment_month,
            sip_amount: sip_amount,
            sip_penalty_month: sip_penalty_month,
            sip_penalty_amount: sip_penalty_amount,
            sip_payment_mode: sip_payment_mode,
            sip_payment_refno: sip_payment_refno,
            sip_payment_receivedBy: sip_payment_receivedBy,
            sip_payment_receivedDate: sip_payment_receivedDate,
            branch_id:branch_id
        }
        const sipPayment = new sipPaymentModel(DataToSave);
        await sipPayment.save();

        res.status(201).json({ message: 'Payment added successfully',status:true ,sipPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipPaymentByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var sipPayment = await sipPaymentModel.aggregate([
            {$match:{_id:new ObjectId(req.params.payment_id)}},
          ])
        if (sipPayment.length == 0) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        res.status(200).json({ sipPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipPaymentAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var sipPayment = await sipPaymentModel.find().skip(skip).limit(limit)
        if (!sipPayment) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sipPayment });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSipPaymentAction = async (req, res) => {
    try {

        var sipPayment = await sipPaymentModel.deleteOne({_id:new ObjectId(req.params.payment_id)})
        res.status(201).json({ message: 'Payment deleted successfully',status:true, sipPayment });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateSipPaymentAction = async (req, res) => {

    const{sippayment_receiptno, sipmember_id, sipmember_name, sip_payment_month, sip_amount, sip_penalty_month, sip_penalty_amount, sip_payment_mode, sip_payment_refno, sip_payment_receivedBy, sip_payment_receivedDate,branch_id} = req.body; 

    try {

        var DataToSave = {
            sippayment_receiptno: sippayment_receiptno,
            sipmember_id: sipmember_id,
            sipmember_name: sipmember_name,
            sip_payment_month: sip_payment_month,
            sip_amount: sip_amount,
            sip_penalty_month: sip_penalty_month,
            sip_penalty_amount: sip_penalty_amount,
            sip_payment_mode: sip_payment_mode,
            sip_payment_refno: sip_payment_refno,
            sip_payment_receivedBy: sip_payment_receivedBy,
            sip_payment_receivedDate: sip_payment_receivedDate,
            branch_id:branch_id
        }
        
        const sipPayment = await sipPaymentModel.findByIdAndUpdate({_id:new ObjectId(req.params.payment_id)},DataToSave);


        res.status(201).json({ message: 'Payment updated successfully',status:true ,sipPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};