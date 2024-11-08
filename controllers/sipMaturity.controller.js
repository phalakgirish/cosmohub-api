import mongoose from "mongoose";
import sipMaturityModel from "../models/sipMaturity.model.js";
import multer from 'multer';
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import clientModel from "../models/client.model.js";
import sipPaymentModel from "../models/sipPayment.model.js";
import sipSlabModel from "../models/sipSlab.model.js";
import luckyDrawModel from "../models/luckyDraw.model.js";

const ObjectId = mongoose.Types.ObjectId;

var uniqueName = Date.now();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, uniqueName+file.originalname);
    }
  })

  const upload = multer({ storage: storage }).fields([
    { name: 'sip_maturity_doc', maxCount: 1 }, // Single file for 'profilePic' field
  ]);

export const createSipMaturityAction = async (req, res) => {
    
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err);
              } else if (err) {
                // An unknown error occurred when uploading.
                console.log(err);
              } 
              else{

                const{client_id, sipmember_id, sipmember_name, sip_maturity_amount, sip_payment_mode, sip_payment_paidBy, sip_payment_paidDate,sip_maturity_doc,branch_id} = req.body;   

                var sipMaturityDetails = await sipMaturityModel.find();

                let ActualNo = 0
                let NewReceipt_No = ''
                if(sipMaturityDetails.length > 0)
                {
                    for(let val of sipMaturityDetails)
                    {
                        const splitNumbers = val.sipmaturity_receiptno.split('-').map((num) => parseFloat(num.trim()));
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
                    NewReceipt_No = 'SIPM-'+ActualNo.toString()
                }
                else
                {
                    ActualNo = ActualNo+1;
                    NewReceipt_No = 'SIPM-'+ActualNo.toString()
                }
                    var DataToSave = {
                        sipmaturity_receiptno: NewReceipt_No,
                        client_id: client_id,
                        sipmember_id: sipmember_id,
                        sipmember_name: sipmember_name,
                        sip_maturity_amount: parseFloat(sip_maturity_amount),
                        sip_payment_mode: sip_payment_mode,
                        sip_payment_paidBy: sip_payment_paidBy,
                        sip_payment_paidDate: sip_payment_paidDate,
                        sip_maturity_doc: req.files.sip_maturity_doc[0].filename,
                        branch_id:branch_id
                    }

                    const sipMPayment = new sipMaturityModel(DataToSave);
                    await sipMPayment.save();

                    var sipMPaymentDetails = await sipPaymentModel.aggregate([
                        {$match:{sipmember_id:new ObjectId(sipmember_id)}}
                    ]).sort({sip_payment_month:1});

                    
                    var getStartDateOfSIP = getDateOfMonth(sipMPaymentDetails[0].sip_payment_month,'Start')

                    var sipLuckyDrawDetils = await luckyDrawModel.find({$and:[{spimember_id:new ObjectId(sipmember_id)},{payment_status:'Pending'}]})

                    

                    for(let val of sipLuckyDrawDetils)
                    {
                        var getEndDateofMonth = getDateOfMonth(val.luckydraw_month,'End')
                        var monthcount = getMonthDifference(getStartDateOfSIP,getEndDateofMonth)
                
                        var sip_slab_bonus_Amount = await sipSlabModel.find({$and:[{sip_slab_from:{$lte:monthcount}},{sip_slab_to:{$gte:monthcount}},{sip_rank:val.luckydraw_rank}]});

                        var sip_luckyDrawUpdate = await luckyDrawModel.updateOne({_id:new ObjectId(val._id)},{$set:{payment_status:'Done'}})

                        if(val.luckydraw_rank == '1' && sip_slab_bonus_Amount[0].sip_status == 'Discontinue')
                        {
                            var sip_member = await sipMemberMgmtModel.updateOne({_id:new ObjectId(sipmember_id)},{$set:{sipmember_status:'Discontinue'}})
                        }
                    }

                    res.status(201).json({ message: 'SIP Maturity Payment added successfully',status:true ,sipMPayment });
        }})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipMaturityByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var sipMPayment = await sipMaturityModel.aggregate([
            {$match:{_id:new ObjectId(req.params.payment_id)}},
          ])
        if (sipMPayment.length == 0) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        res.status(200).json({ sipMPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipMaturityAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var sipMPayment = await sipMaturityModel.aggregate([
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
                    localField: "sip_payment_paidBy",
                    foreignField: "_id",
                    as: "paidBy",
                }
            },
            {
                $project:{
                    _id:1,
                    sipmaturity_receiptno:1,
                    Sip_id:{ $arrayElemAt: ["$Sip_id.sipmember_id", 0] },
                    sipmember_name:1,
                    sip_maturity_amount: 1,
                    sip_payment_paidBy:{ $arrayElemAt: ["$paidBy.staff_name", 0] },
                    sip_payment_paidDate:1
                }
            }
        ]) //.skip(skip).limit(limit)
        if (!sipMPayment) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sipMPayment });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSipMaturityAction = async (req, res) => {
    try {

        var sipMPayment = await sipMaturityModel.deleteOne({_id:new ObjectId(req.params.payment_id)})
        res.status(201).json({ message: 'SIP Maturity Payment deleted successfully',status:true, sipMPayment });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateSipMaturityAction = async (req, res) => {

    try {

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err);
              } else if (err) {
                // An unknown error occurred when uploading.
                console.log(err);
              } 
              else{

                const{sipmaturity_receiptno, client_id, sipmember_id, sipmember_name, sip_maturity_amount, sip_payment_mode, sip_payment_paidBy, sip_payment_paidDate,sip_maturity_doc,branch_id} = req.body; 
                
                const sipMaturity_record = await sipMaturityModel.find({_id:req.params.payment_id});
                
                let sipMDocument = sipMaturity_record[0].sip_maturity_doc

                if(req.files.sip_maturity_doc != undefined)
                {
                    sipMDocument = req.files.sip_maturity_doc[0].filename
                }

                    var DataToSave = {
                        sipmaturity_receiptno: sipmaturity_receiptno,
                        client_id: client_id,
                        sipmember_id: sipmember_id,
                        sipmember_name: sipmember_name,
                        sip_maturity_amount: parseFloat(sip_maturity_amount),
                        sip_payment_mode: sip_payment_mode,
                        sip_payment_paidBy: sip_payment_paidBy,
                        sip_payment_paidDate: sip_payment_paidDate,
                        sip_maturity_doc: sipMDocument,
                        branch_id:branch_id
                    }
                    

                    const sipMPayment = await sipMaturityModel.findByIdAndUpdate({_id:new ObjectId(req.params.maturity_id)},DataToSave);
                    
                    res.status(201).json({ message: 'SIP Maturity Payment updated successfully',status:true ,sipMPayment });
        }})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipMaturityAmountBySipIdAction = async (req, res) => {
    try {

        var sipMPayment = await sipMaturityModel.aggregate([
            {$match:{sipmember_id:new ObjectId(req.params.sipmember_id)}},
            {
                $group:{
                    _id: "$sipmember_id",
                    total: { $sum: "$sip_amount" },
                    count: { $sum: 1 }
                }
            },
        ])

        
        if (!sipMPayment) {
            return res.status(404).json({ message: 'Payment not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sipMPayment });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipPaidAmountAction = async (req, res) => {
    try {

        
        var sipMPayment = await sipPaymentModel.aggregate([
            {$match:{sipmember_id:new ObjectId(req.params.sip_id)}},
            {
                $group:{
                    _id:"$sipmember_id",
                    totalSipAmount:{$sum:"$sip_amount"},
                    monthCount:{$sum:1}

                }
            }
        ]);
        

        var sipMPaymentDetails = await sipPaymentModel.aggregate([
            {$match:{sipmember_id:new ObjectId(req.params.sip_id)}}
        ]).sort({sip_payment_month:1});

        var luckyDarawDetails = await luckyDrawModel.find({$and:[{spimember_id:new ObjectId(req.params.sip_id)},{payment_status:'Pending'}]}).sort({luckydraw_month:1})
        
        var total_amount = 0

        if(luckyDarawDetails.length > 0)
        {
            var getStartDateOfSIP = getDateOfMonth(sipMPaymentDetails[0].sip_payment_month,'Start')
            for(let val of luckyDarawDetails)
            {
                var getEndDateofMonth = getDateOfMonth(val.luckydraw_month,'End')
                var monthcount = getMonthDifference(getStartDateOfSIP,getEndDateofMonth)
                
                var sip_slab_bonus_Amount = await sipSlabModel.find({$and:[{sip_slab_from:{$lte:monthcount}},{sip_slab_to:{$gte:monthcount}},{sip_rank:val.luckydraw_rank}]});

                total_amount = total_amount + sip_slab_bonus_Amount[0].sip_amount

                if(val.luckydraw_rank == '1')
                {
                    total_amount = total_amount + sipMPayment[0].totalSipAmount
                }

            }
        }
        else
        {
            var sip_member_details = await sipMemberMgmtModel.findOne({_id:new ObjectId(req.params.sip_id)})

            // console.log(sip_member_details);

            var maturity_date  = sip_member_details.sipmember_maturity_date

            maturity_date.setHours(23,59,59,0);
            const todayDate = new Date()
            // console.log(todayDate.toISOString());

            if(maturity_date < todayDate)
            {
                total_amount = total_amount + (sipMPayment[0].totalSipAmount*2)
            }  
        }

        
        res.status(200).json({ sipMAmount: total_amount });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getDateOfMonth = (monthstr,pos)=>{
    const [year, month] = monthstr.split('-').map(Number);
    let MonthDate
    // Start date of the month
    if(pos == 'Start')
    {
        MonthDate = new Date(year, month - 1, 1);
    }
    else
    {
        MonthDate = new Date(year, month, 0);
    }
    
    MonthDate.setMinutes(MonthDate.getMinutes()+330);

  return MonthDate;
}

const getMonthDifference = (fromDate, toDate)=>{

    const fromYear = fromDate.getFullYear();
    const fromMonth = fromDate.getMonth();
    const toYear = toDate.getFullYear();
    const toMonth = toDate.getMonth();

    // Calculate the difference in years and months
    const yearDifference = toYear - fromYear;
    const monthDifference = (toMonth - fromMonth)+1;

    // Total months difference
    return yearDifference * 12 + monthDifference;
}



