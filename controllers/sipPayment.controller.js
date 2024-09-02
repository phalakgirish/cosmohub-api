import mongoose from "mongoose";
import sipPaymentModel from "../models/sipPayment.model.js";
import sipMemberMgmtModel from "../models/sipManagerment.model.js";



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

        var sipPaymentReciept = await sipPaymentModel.aggregate([
            {$match:{_id:new ObjectId(sipPayment._id)}},
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
                    sip_payment_mode:1,
                    sip_payment_refno:1,
                    sip_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                    sip_payment_receivedDate:1
                }
            }
        ])



        res.status(201).json({ message: 'SIP Payment added successfully',status:true ,sipPayment,sipPaymentReciept });
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
        const limit = 100;
        const skip = (pageNumber - 1) * limit;
        var sipPayment = await sipPaymentModel.aggregate([
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
                    sip_payment_receivedBy:{ $arrayElemAt: ["$receivedBy.staff_name", 0] },
                    sip_payment_receivedDate:1
                }
            }
        ]).skip(skip).limit(limit)
        // console.log(sipPayment);
        
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
        res.status(201).json({ message: 'SIP Payment deleted successfully',status:true, sipPayment });

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


        res.status(201).json({ message: 'SIP Payment updated successfully',status:true ,sipPayment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getPenaltyAmountBySIPMemberIdction = async (req, res) => {

    const{sip_id,month,date} = req.body;   
    // console.log(req.body);
    

    try {

        const sip_member_dts = await sipMemberMgmtModel.find({_id:new ObjectId(sip_id)})

        var SIPMonths = getYearMonthRange(sip_member_dts[0].sipmember_doj,sip_member_dts[0].sipmember_maturity_date);

        // console.log(SIPMonths);
        let PenaltyCount = 0
        let receivedDate = new Date(date);
        let penaltyAmount = 0;
        // console.log(receivedDate);
        

        var MonthMonthStartDate = getDateOfMonth(month,'Start')
        var MonthMonthEndDate = getDateOfMonth(month,'End')
        
        

        if(receivedDate >= MonthMonthStartDate && receivedDate <= MonthMonthEndDate)
        {
            var currentMonthIndex = SIPMonths.indexOf(month)

            var previousMonths = SIPMonths.slice(currentMonthIndex-2,currentMonthIndex)

            for(let val of previousMonths)
            {
                let month10thDay = getDateOfMonth(val,'')

                let sipMonthData = await sipPaymentModel.find({$and:[{sip_payment_month:val.toString()},{sipmember_id:new ObjectId(sip_id)}]});

                let sipPaymentDetails = sipMonthData[0]

                if(sipPaymentDetails.sip_payment_receivedDate > month10thDay && sipPaymentDetails.sip_penalty_amount == 0)
                { 
                    PenaltyCount = PenaltyCount + 1
                }
            }

            let currentMonth10thDate = getDateOfMonth(month,'10th')
            let todaysDate = new Date(date)
            if(todaysDate > currentMonth10thDate)
            {
                PenaltyCount = PenaltyCount + 1
            }

            
        }
        // console.log(PenaltyCount);
        
        for(let i = 1; i<=PenaltyCount; i++)
        {
            if(i == 1)
                penaltyAmount = 250
            else
                penaltyAmount = penaltyAmount * 2   
        }

        res.status(201).json({ message: 'SIP Payment updated successfully',status:true, penaltyAmount});
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
    else if(pos == '10th')
    {
        MonthDate = new Date(year, month-1, 10);
    }
    else
    {
        MonthDate = new Date(year, month, 0);
    }
    
    
    if(pos != 'Start')
    {
        MonthDate.setHours(29,29,59,0)
    }
    else
    {
        MonthDate.setMinutes(MonthDate.getMinutes()+330);
    }
    return MonthDate;
}

const getYearMonthRange = (startDate, endDate)=>{
    const months = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        months.push(`${year}-${month}`);

        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
}