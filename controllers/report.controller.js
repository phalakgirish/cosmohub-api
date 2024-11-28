import mongoose from "mongoose";
import branchModel from "../models/branch.model.js";
import sipPaymentModel from "../models/sipPayment.model.js";
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import luckyDrawModel from "../models/luckyDraw.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const getMonthWisePaymentAction = async (req,res)=>{
    try{

        const branchId = req.query.branchId;
        const month = req.query.month

        var query = { sip_payment_month: month };
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
                    $lookup:{
                        from:'branches',
                        localField:'branch_id',
                        foreignField:'_id',
                        as:'branch'
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
                        sip_payment_receivedDate:1,
                        branch:{ $arrayElemAt: ["$branch.branch_name", 0] }
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
                    $lookup:{
                        from:'branches',
                        localField:'branch_id',
                        foreignField:'_id',
                        as:'branch'
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
                        sip_payment_receivedDate:1,
                        branch:{ $arrayElemAt: ["$branch.branch_name", 0] }
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

export const getSIPMemberDetailsAction = async (req,res)=>{
    try{

        const branchId = req.query.branchId;
        // const sip_id = req.query.sip_id
        // console.log(branchId);
        

        var query = branchId=='0' ?{}:{ branch_id: new ObjectId(branchId) };
        let sipMemberDetails = await sipMemberMgmtModel.aggregate([
                {$match:query},
                {
                    $lookup:{
                        from: "clients",
                        localField: "client_id",
                        foreignField: "_id",
                        as: "clients",
                    }
                },
                {
                    $lookup:{
                        from: "sip_payments",
                        localField: "_id",
                        foreignField: "sipmember_id",
                        as: "Sip_Payments",
                    }
                },
                {
                    $unwind: {
                        path: "$Sip_Payments",    
                        preserveNullAndEmptyArrays: true // Preserve documents without matching payment records
                      }
                    // preserveNullAndEmptyArrays: true
                },
                {
                    $unwind: "$clients"
                },
                {
                    $group:{
                        _id:{
                            sipmember_id: "$sipmember_id",
                            client_id:"$clients.client_id",
                            sipmember_name:"$sipmember_name",
                            sipmember_doj:"$sipmember_doj",
                            sipmember_maturity_date:"$sipmember_maturity_date"
                        },
                        totalSIPAmount:{$sum:{ $ifNull: ["$Sip_Payments.sip_amount", 0] }},
                        totalSIPPenaltyAmount:{$sum:{ $ifNull: ["$Sip_Payments.sip_penalty_amount", 0] }},
                    }
                },
                {
                    $project:{
                        // _id:0,
                        sipmember_id:"$_id.sipmember_id",
                        client_id:"$_id.client_id",
                        sipmember_name:"$_id.sipmember_name",
                        sipmember_doj:"$_id.sipmember_doj",
                        sipmember_maturity_date:"$_id.sipmember_maturity_date",
                        totalSIPAmount:1,
                        totalSIPPenaltyAmount:1
                    }
                },
                {
                    $sort: { sipmember_id: 1 } // Sort by totalSIPAmount in descending order
                }
            ])
        

            
        if (!sipMemberDetails) {
            return res.status(404).json({ message: 'SIP Member Not Found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sipMemberDetails });
    }
    catch(error)
    {
        res.status(400).json({ error: error.message });
    }
}

export const getLuckyDrawMemberDetailsAction = async (req,res)=>{
    try{

        const month = req.query.month

        let sipMemberDetails = await sipMemberMgmtModel.aggregate([
            {$match:{sipmember_status:'Continue'}},
            {
                $lookup:{
                    from: "clients",
                    localField: "client_id",
                    foreignField: "_id",
                    as: "clients",
                }
            },
            {
                $lookup:{
                    from:'branches',
                    localField:'branch_id',
                    foreignField:'_id',
                    as:'branch'
                }
            },
            {
                $lookup:{
                    from: "sip_payments",
                    localField: "_id",
                    foreignField: "sipmember_id",
                    as: "Sip_Payments",
                }
            },
            {
                $lookup:{
                    from: "sip_categories",
                    localField: "sipmember_sip_category",
                    foreignField: "_id",
                    as: "Sip_Category",
                }
            },
            {
                $unwind: "$Sip_Payments"
            },
            {
                $unwind: "$clients"
            },
            {
                $unwind: "$branch"
            },
            {
                $unwind: "$Sip_Category"
            },
            
            {
                $group:{
                    _id:{
                        _id:"$_id",
                        sipmember_id: "$sipmember_id",
                        client_id:"$clients.client_id",
                        client_city:"$clients.client_city",
                        sipmember_name:"$sipmember_name",
                        sipmember_doj:"$sipmember_doj",
                        sipmember_maturity_date:"$sipmember_maturity_date",
                        sip_member_category:"$Sip_Category.sipcategory_name",
                        branch:"$branch.branch_name"
                    },
                    totalSIPAmount:{$sum:"$Sip_Payments.sip_amount"},
                    totalSIPPenaltyAmount:{$sum:"$Sip_Payments.sip_penalty_amount"},
                    totalCount:{$sum:1}
                }
            },
            {
                $project:{
                    _id:"$_id._id",
                    Sip_id:"$_id.sipmember_id",
                    client_id:"$_id.client_id",
                    client_city:"$_id.client_city",
                    sipmember_name:"$_id.sipmember_name",
                    sipmember_doj:"$_id.sipmember_doj",
                    sipmember_maturity_date:"$_id.sipmember_maturity_date",
                    sip_member_category:"$_id.sip_member_category",
                    branch:"$_id.branch",
                    totalSIPAmount:1,
                    totalSIPPenaltyAmount:1,
                    totalCount:1
                }
            },
            {
                $sort: { sipmember_id: 1 } // Sort by totalSIPAmount in descending order
            }
        ])
        let sipPayment = []
        // console.log(sipMemberDetails);

        for(let val of sipMemberDetails)
        {
            const sipPaymentDetails = await sipPaymentModel.find({sipmember_id:new ObjectId(val._id)})

            const luckdarwDetails = await luckyDrawModel.find({spimember_id:new ObjectId(val._id)})

            const previousrank = luckdarwDetails.map((val)=> getOrdinal(parseInt(val.luckydraw_rank))).join(', ')

            let SipMonthPaymnt = sipPaymentDetails.filter((item)=> item.sip_payment_month == month)

            if(SipMonthPaymnt.length > 0)
            {
                val['sip_amount'] = SipMonthPaymnt[0].sip_amount; 
                val['sip_payment_mode'] = SipMonthPaymnt[0].sip_payment_mode;
                val['sip_payment_month'] = formatMonthDate(SipMonthPaymnt[0].sip_payment_month);
                val['Sip_previous_rank'] = previousrank
                sipPayment.push(val)
                continue;
            }
            else if(val.totalCount >= 25)
            {
                val['sip_amount'] = sipMemberDetails[sipMemberDetails.length -1].sip_amount;
                val['sip_payment_mode'] =  sipMemberDetails[sipMemberDetails.length -1].sip_payment_mode;
                val['sip_payment_month'] = formatMonthDate(SipMonthPaymnt[sipMemberDetails.length -1].sip_payment_month);  
                val['Sip_previous_rank'] = previousrank 
                sipPayment.push(val)
                continue;
            }
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

const formatMonthDate = (dateString)=> {
    const [year, month] = dateString.split('-');
    
    // Create a date object using the year and month
    const date = new Date(`${year}-${month}-01`);
    
    // Format the month to get the full month name
    const options = { month: "long" };
    const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
    
    return `${monthName}-${year}`;
}

const getOrdinal = (n)=> {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

