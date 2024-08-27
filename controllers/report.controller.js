import mongoose from "mongoose";
import branchModel from "../models/branch.model.js";
import sipPaymentModel from "../models/sipPayment.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const getMonthWisePaymentAction = async (req,res)=>{
    try{

        const branchId = req.query.branchId;
        const month = req.query.month

        var query = month=='' ?{}:{ sip_payment_month: month };
        let sipPayment
        if(branchId == "0")
        {
            sipPayment = await sipPaymentModel.aggregate([
                {$match:query},
                {
                    $lookup:{
                        from: "sip_member_mgmts",
                        localField: "sipmember_id",
                        foreignField: "_id",
                        as: "Sip_id",
                    }
                },
                {
                    $lookup:{
                        from: "staffs",
                        localField: "sip_payment_receivedBy",
                        foreignField: "_id",
                        as: "receivedBy",
                    }
                },
                {
                    $project:{
                        _id:1,
                        sippayment_receiptno:1,
                        Sip_id:{ $arrayElemAt: ["$Sip_id.sipmember_id", 0] },
                        sipmember_name:1,
                        sip_payment_month: 1,
                        sip_amount: 1,
                        sip_penalty_month: 1,
                        sip_penalty_amount: 1,
                        sip_payment_mode: 1,
                        sip_payment_refno: 1,
                        sip_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                        sip_payment_receivedDate:1
                    }
                }
            ])
        }
        else
        {
            sipPayment = await sipPaymentModel.aggregate([
                {$match:{$and:[query,{branchId:new ObjectId(branchId)}]}},
                {
                    $lookup:{
                        from: "sip_member_mgmts",
                        localField: "sipmember_id",
                        foreignField: "_id",
                        as: "Sip_id",
                    }
                },
                {
                    $lookup:{
                        from: "staffs",
                        localField: "sip_payment_receivedBy",
                        foreignField: "_id",
                        as: "receivedBy",
                    }
                },
                {
                    $project:{
                        _id:1,
                        sippayment_receiptno:1,
                        Sip_id:{ $arrayElemAt: ["$Sip_id.sipmember_id", 0] },
                        sipmember_name:1,
                        sip_payment_month: 1,
                        sip_amount: 1,
                        sip_penalty_month: 1,
                        sip_penalty_amount: 1,
                        sip_payment_mode: 1,
                        sip_payment_refno: 1,
                        sip_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                        sip_payment_receivedDate:1
                    }
                }
            ])
        }
        
        

        if (!sipPayment) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sipPayment });
    }
    catch(error)
    {
        res.status(400).json({ error: error.message });
    }
}

export const getSIPMemberWisePaymentAction = async (req,res)=>{
    try{

        // const branchId = req.query.branchId;
        const sip_id = req.query.sip_id
        

        var query = sip_id=='' ?{}:{ sipmember_id: new ObjectId(sip_id) };
        let sipPayment = await sipPaymentModel.aggregate([
                {$match:query},
                {
                    $lookup:{
                        from: "sip_member_mgmts",
                        localField: "sipmember_id",
                        foreignField: "_id",
                        as: "Sip_id",
                    }
                },
                {
                    $lookup:{
                        from: "staffs",
                        localField: "sip_payment_receivedBy",
                        foreignField: "_id",
                        as: "receivedBy",
                    }
                },
                {
                    $project:{
                        _id:1,
                        sippayment_receiptno:1,
                        Sip_id:{ $arrayElemAt: ["$Sip_id.sipmember_id", 0] },
                        sipmember_name:1,
                        sip_payment_month: 1,
                        sip_amount: 1,
                        sip_penalty_month: 1,
                        sip_penalty_amount: 1,
                        sip_payment_mode: 1,
                        sip_payment_refno: 1,
                        sip_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                        sip_payment_receivedDate:1
                    }
                }
            ])
        
        

        if (!sipPayment) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sipPayment });
    }
    catch(error)
    {
        res.status(400).json({ error: error.message });
    }
}