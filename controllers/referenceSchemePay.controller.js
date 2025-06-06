import mongoose from "mongoose";
import { SendDiscontuneMemberEmail } from "../env/SendEmail.js";
import referenceSchemePaymentModel from "../models/referenceSchemePay.model.js";



const ObjectId = mongoose.Types.ObjectId;

export const createReferenceSchemePaymentAction = async (req, res) => {
    const{client_id,client_name,reference_category,reference_scheme,reference_scheme_amount,ref_payment_mode,ref_payment_refno,ref_payment_receivedBy,ref_payment_receivedDate,ref_payment_expirationDate,branch_id} = req.body; 

    try {

        var refSchPaymentDetails = await referenceSchemePaymentModel.find();

                let ActualNo = 0
                let NewReceipt_No = ''
                if(refSchPaymentDetails.length > 0)
                {
                    for(let val of refSchPaymentDetails)
                    {
                        const splitNumbers = val.refschpayment_receiptno.split('-').map((num) => parseFloat(num.trim()));
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
                    NewReceipt_No = 'REFS-'+ActualNo.toString()
                }
                else
                {
                    ActualNo = ActualNo+1;
                    NewReceipt_No = 'REFS-'+ActualNo.toString()
                }

        var DataToSave = {
            refschpayment_receiptno: NewReceipt_No,
            client_id: client_id,
            client_name: client_name,
            reference_category: reference_category,
            reference_scheme: reference_scheme,
            reference_scheme_amount: reference_scheme_amount,
            ref_payment_mode: ref_payment_mode,
            ref_payment_refno: ref_payment_refno,
            ref_payment_receivedBy: ref_payment_receivedBy,
            ref_payment_receivedDate: ref_payment_receivedDate,
            ref_payment_expirationDate:ref_payment_expirationDate,
            branch_id: branch_id
        }
        const refSchPayment = new referenceSchemePaymentModel(DataToSave);
        await refSchPayment.save();

        var refSchPaymentReciept = await referenceSchemePaymentModel.aggregate([
            {$match:{_id:new ObjectId(refSchPayment._id)}},
            {
                $lookup:{
                    from: "clients",
                    localField: "client_id",
                    foreignField: "_id",
                    as: "client_id",
                }
            },
            {
                $lookup:{
                    from: "staffs",
                    localField: "ref_payment_receivedBy",
                    foreignField: "_id",
                    as: "receivedBy",
                }
            },
            {
                $project:{
                    _id:1,
                    refschpayment_receiptno:1,
                    client_id:{ $arrayElemAt: ["$client_id.client_id", 0] },
                    client_name:1,
                    reference_scheme_amount: 1,
                    ref_payment_mode:1,
                    ref_payment_refno:1,
                    ref_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                    ref_payment_receivedDate:1,
                    ref_payment_expirationDate:1,
                }
            }
        ])



        res.status(201).json({ message: 'Reference Scheme Payment added successfully',status:true ,refSchPayment,refSchPaymentReciept });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceSchemePaymentByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var refSchPayment = await referenceSchemePaymentModel.aggregate([
            {$match:{_id:new ObjectId(req.params.payment_id)}},
          ])
        if (refSchPayment.length == 0) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        res.status(200).json({ refSchPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceSchemePaymentAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 100;
        const skip = (pageNumber - 1) * limit;
        var refSchPayment = await referenceSchemePaymentModel.aggregate([
            {
                $lookup:{
                    from: "clients",
                    localField: "client_id",
                    foreignField: "_id",
                    as: "Client_id",
                }
            },
            {
                $lookup:{
                    from: "staffs",
                    localField: "ref_payment_receivedBy",
                    foreignField: "_id",
                    as: "receivedBy",
                }
            },
            {
                $project:{
                    _id:1,
                    refschpayment_receiptno:1,
                    client_id:{ $arrayElemAt: ["$Client_id.client_id", 0] },
                    client_name:1,
                    reference_scheme_amount: 1,
                    ref_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                    ref_payment_receivedDate:1,
                    ref_payment_expirationDate:1
                }
            }
        ]) //.skip(skip).limit(limit)
        // console.log(sipPayment);
        
        if (!refSchPayment) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ refSchPayment });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteReferenceSchPaymentAction = async (req, res) => {
    try {

        var refSchPayment = await referenceSchemePaymentModel.deleteOne({_id:new ObjectId(req.params.payment_id)})

        res.status(201).json({ message: ' Reference Scheme Payment deleted successfully',status:true, refSchPayment });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateReferenceSchemePaymentAction = async (req, res) => {

    const{refschpayment_receiptno,client_id,client_name,reference_category,reference_scheme,reference_scheme_amount,ref_payment_mode,ref_payment_refno,ref_payment_receivedBy,ref_payment_receivedDate, ref_payment_expirationDate, branch_id} = req.body; 

    try {

        var DataToSave = {
            refschpayment_receiptno: refschpayment_receiptno,
            client_id: client_id,
            client_name: client_name,
            reference_category: reference_category,
            reference_scheme: reference_scheme,
            reference_scheme_amount: reference_scheme_amount,
            ref_payment_mode: ref_payment_mode,
            ref_payment_refno: ref_payment_refno,
            ref_payment_receivedBy: ref_payment_receivedBy,
            ref_payment_receivedDate: ref_payment_receivedDate,
            ref_payment_expirationDate:ref_payment_expirationDate,
            branch_id: branch_id
        }
        
        const refSchPayment = await referenceSchemePaymentModel.findByIdAndUpdate({_id:new ObjectId(req.params.payment_id)},DataToSave);


        res.status(201).json({ message: 'Reference Scheme Payment updated successfully',status:true ,refSchPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const referenceSchemePaymentDataCorrect = async (req,res)=>{
    var ClientErrorDetails = [];
    var clientDetails = await referenceSchemePaymentModel.find();

    for(let val of clientDetails)
    {
        try{
            const expirationDate = new Date(val.ref_payment_receivedDate);
            expirationDate.setDate(expirationDate.getDate() + 365);
            
            var reference_payment = await referenceSchemePaymentModel.updateOne({_id:new ObjectId(val._id)},{$set:{ref_payment_expirationDate:expirationDate}})
            
        }
        catch(error)
        {
            ClientErrorDetails.push({ error: error.message,val })
        }
        
    }
}