import mongoose from "mongoose";
import sipPaymentModel from "../models/sipPayment.model.js";
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import { SendDiscontuneMemberEmail } from "../env/SendEmail.js";
import cilentWalletModel from "../models/clientWallet.model.js";
import sipReferenceModel from "../models/sipReference.model.js";
import referenceSchemePaymentModel from "../models/referenceSchemePay.model.js";
import clientModel from "../models/client.model.js";
import referenceLevelModel from "../models/referenceLevel.model.js";
import referenceSchemeModel from "../models/referenceScheme.model.js";



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

                var sipMemberDts = await sipMemberMgmtModel.findOne({_id:new ObjectId(sipmember_id)})
                var ClientDetails = await clientModel.findOne({_id:new ObjectId(sipMemberDts.client_id)})

                // var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({client_id:new ObjectId(ClientDetails.sip_refered_by_clientId)}).sort({_id: -1})

                var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(ClientDetails.sip_refered_by_clientId)},{reference_category:"SIP"}]}).sort({_id: -1})
                // console.log(Client_Ref_sch_pay_Dts);
                

                if(ClientDetails.sip_refered_by_clientId != null)
                {
                    if(Client_Ref_sch_pay_Dts != null)
                    {
                        var comissionType = 'Spot'
                        var comissionWay = "Single"
                        var referenceSchemeDetails = await referenceSchemeModel.findOne({_id:new ObjectId(Client_Ref_sch_pay_Dts.reference_scheme)})
                        if(referenceSchemeDetails.refScheme_comission == "Level" || referenceSchemeDetails.refScheme_comission == "Direct")
                        {
                            comissionType = 'Recurring'
                            if(referenceSchemeDetails.refScheme_comission == "Direct")
                            {
                                comissionWay = "Direct"
                            }  
                        }

                        var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(sipMemberDts.client_id)},{sip_refered_by:new ObjectId(ClientDetails.sip_refered_by_clientId)},{comission_type:comissionType}]}).sort({_id:-1});

                        var newdate = new Date();
                        // newdate.setMinutes(newdate.getMinutes()+330);
                        var todaydate = newdate.getFullYear()+'-'+((newdate.getMonth() + 1)<=9?'0'+(newdate.getMonth() + 1):newdate.getMonth() + 1)+'-'+(newdate.getDate());
                        var from_date = new Date(todaydate);
                        from_date.setHours(5,30,0,0);
                        
                        var ReferedClient_id = []
                        var UpdatedClientId = [] 

                        var sip_refered_by_clientId = ClientDetails.sip_refered_by_clientId;

                        if(!client_reference_details)
                        {
                            var referedClientCount = await sipReferenceModel.find({sip_refered_by:new ObjectId(ClientDetails.sip_refered_by_clientId)})

                            if(referedClientCount.length >= 5)
                            {
                                var GetReferedClientDetails = await clientModel.findOne({_id:new ObjectId(ClientDetails.sip_refered_by_clientId)})
        
                                if(GetReferedClientDetails.sip_refered_by_clientId != null)
                                {
                                    var AllReferedClient =  await sipReferenceModel.find({sip_refered_by:new ObjectId(GetReferedClientDetails.sip_refered_by_clientId)}).sort({_id:1});
        
                                    if(AllReferedClient.length > 0)
                                    {
                                        var AllReferedClientId = [];
        
                                        for(let id of AllReferedClient)
                                        {
                                            if(id.sipmember_clientid != sip_refered_by_clientId)
                                            {
                                                    AllReferedClientId.push(id.sipmember_clientid)
                                            }  
                                        }
        
                                        var countId = await sipReferenceModel.aggregate([
                                            {$match:{sip_refered_by:{$in:AllReferedClientId}}},
                                            {
                                                $group:{
                                                    _id:{
                                                        sip_refered_by:"$sip_refered_by"
                                                    },
                                                    totalCount:{$sum: 1}
                                                }
                                            }
                                        ])
        
                                        // console.log(countId);
        
                                        var referenceId = countId.filter((item)=> item.totalCount < 5)
        
                                        if(referenceId.length > 0)
                                        {
                                            var tempcount = 0
                                            var tempreferenceId
                                            var tempReferDate = null
                                            for(let val of referenceId)
                                            {
                                                    
                                                if(val.totalCount > tempcount)
                                                {
                                                    tempcount = val.totalCount
                                                    tempreferenceId = val._id.sip_refered_by
                                                    var referencDetils = await sipReferenceModel.findOne({sipmember_clientid:new ObjectId(val._id.sip_refered_by)})
        
                                                    tempReferDate = referencDetils.sip_referedDate
                                                }
                                                else if(val.totalCount == tempcount)
                                                {
                                                    var referencDetils = await sipReferenceModel.findOne({sipmember_clientid:new ObjectId(val._id.sip_refered_by)})
        
                                                    if(tempReferDate != null)
                                                    {
                                                        if(referencDetils.sip_referedDate > tempReferDate)
                                                        {
                                                            tempcount = val.totalCount
                                                            tempreferenceId = val._id.sip_refered_by
                                                            tempReferDate = referencDetils.sip_referedDate
                                                        }
                                                    }
                                                    else
                                                    {
                                                        tempcount = val.totalCount
                                                        tempreferenceId = val._id.sip_refered_by
                                                        tempReferDate = referencDetils.sip_referedDate
                                                    }   
                                                }
        
                                            }
        
                                            sip_refered_by_clientId = tempreferenceId
        
                                        }
                                    }
                                }
                            }
                            
                            var DataToSaveSIPReference = {
                                sipmember_clientid: sipMemberDts.client_id,
                                sip_refered_by: sip_refered_by_clientId,
                                sip_referedDate: from_date,
                                comission_type: comissionType,
                                branch_id: branch_id
                            }

                            var ClientLevel = await clientModel.findOne({_id: new ObjectId(sip_refered_by_clientId)})
                            ReferedClient_id.push({referedbyclientId:sip_refered_by_clientId,comissionType:comissionType,level:0})

                            var updateClientDetails = await clientModel.updateOne({_id:new ObjectId(sipMemberDts.client_id)},{$set:{sip_refered_by_clientId:sip_refered_by_clientId}})
                            const sip_reference = new sipReferenceModel(DataToSaveSIPReference);
                            await sip_reference.save();
                        }

                        // if( comissionType == 'Spot' )
                        
                        var client_refe_wallet = await ReferencePaymentWallet(sipMemberDts.client_id,sip_amount,sip_refered_by_clientId,Client_Ref_sch_pay_Dts.reference_scheme_amount,(!client_reference_details)?from_date:client_reference_details.sip_referedDate,sipMemberDts.sipmember_doj,comissionType,sip_payment_receivedDate,comissionWay)

                        //{referedbyclientId:ClientDetails.sip_refered_by_clientId,comissionType:comissionType,level:0}
                        ReferenceByLoop:
                            for(let val of ReferedClient_id)
                            {

                                var updatedClient_index = UpdatedClientId.indexOf(val)

                                if(updatedClient_index == -1)
                                {
                                    var samelevelCount = 0
                                    var ReferedByClient_Id = await clientModel.findOne({_id: new ObjectId(val.referedbyclientId)})
                                    
                                    var client_referenceDetails = await sipReferenceModel.find({sip_refered_by: new ObjectId(val.referedbyclientId)})

                                    if(val.comissionType == 'Recurring')
                                    {
                                        for(let client of client_referenceDetails)
                                        {
                                            let client_dts = await clientModel.findOne({$and:[{_id: new ObjectId(client.sipmember_clientid)},{sip_reference_level:{$gte:ReferedByClient_Id.sip_reference_level}}]})
        
                                            // console.log('114',client_dts);
                                                
                                            if(client_dts != null)
                                            {
                                                samelevelCount = samelevelCount + 1
                                            }
                                        }

                                        if(samelevelCount  >= 5)
                                        {
                                            if(ReferedByClient_Id.sip_reference_level <= 6)
                                            {
                                                var client_update_reference_level = await clientModel.updateOne(
                                                { _id: new ObjectId(val.referedbyclientId) },
                                                {
                                                    $set: {
                                                        sip_reference_level: ReferedByClient_Id.sip_reference_level+1,
                                                    },
                                                })   
                                            }          
                                        }
                                    }

                                    // for(let client of client_referenceDetails)
                                    // {
                                    //     let client_dts = await clientModel.findOne({$and:[{_id: new ObjectId(client.sipmember_clientid)},{sip_reference_level:ReferedByClient_Id.sip_reference_level}]})

                                    //     // console.log('114',client_dts);
                                        
                                    //     if(client_dts)
                                    //     {
                                    //         samelevelCount = samelevelCount + 1
                                    //     }
                                    // }

                                    // if(samelevelCount  == 5)
                                    // {
                                    //     if(ReferedByClient_Id.sip_reference_level <= 6)
                                    //     {
                                    //         var client_update_reference_level = await clientModel.updateOne(
                                    //         { _id: new ObjectId(val) },
                                    //             {
                                    //             $set: {
                                    //                 sip_reference_level: ReferedByClient_Id.sip_reference_level+1,
                                    //             },
                                    //             })   
                                    //     }   
                                        
                                    // }  

                                    UpdatedClientId.push(val)
                                    if(ReferedByClient_Id.sip_refered_by_clientId != null)
                                    {
                                        var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(val.referedbyclientId)},{sip_refered_by:new ObjectId(ReferedByClient_Id.sip_refered_by_clientId)}]}).sort({_id:-1});

                                        if(client_reference_details != null)
                                        {
                                            ReferedClient_id.push({referedbyclientId:ReferedByClient_Id.sip_refered_by_clientId,comissionType:client_reference_details.comission_type,level:val.level+1})
                                        }

                                        continue ReferenceByLoop; 
                                    }
                                }    
                            }    
                    }   
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

        if(sip_payment_mode == 'Wallet')
        {
            const client_Id = await sipMemberMgmtModel.findOne({_id:new ObjectId(sipmember_id)})
            const clientWalletBalance = await cilentWalletModel.findOne({client_id:new ObjectId(client_Id.client_id)}).sort({_id: -1}).limit(1)

            var datatoWalletSave = {
                client_id: client_Id.client_id,
                wallet_trans_date: new Date(),
                wallet_trans_type: '',
                wallet_trans_desc: `SIP Payment for Receipt: ${NewReceipt_No}`,
                wallet_credit: 0,
                wallet_debit: (sip_amount+sip_penalty_amount),
                wallet_balance: (clientWalletBalance.wallet_balance - (sip_amount+sip_penalty_amount)),
            }


            var client_wallet = new cilentWalletModel(datatoWalletSave);
            client_wallet.save();
        }

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
                    sip_penalty_month: 1,
                    sip_penalty_amount: 1,
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
        ]) //.skip(skip).limit(limit)
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

        var siplastmonth = SIPMonths[25-1]
        
        

        if((receivedDate >= MonthMonthStartDate && receivedDate <= MonthMonthEndDate) || (siplastmonth === month))
        {
            var currentMonthIndex = SIPMonths.indexOf(month)
            // console.log(currentMonthIndex);
            
            var previousMonths = SIPMonths.slice((currentMonthIndex-2 < 0)?0:currentMonthIndex-2,currentMonthIndex)
            // console.log(previousMonths);
            
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

export const getSIPMemberIdShedulerAction = async (req, res) => {
    try {

        const sip_member_dts = await sipMemberMgmtModel.find({sipmember_status:'Continue'})

        
        let DisconituedMember = []

        for(let val of sip_member_dts)
        {
            var SIPMonths = getYearMonthRange(val.sipmember_doj,val.sipmember_maturity_date);
            let PenaltyCount = 0

            var todayDate = new Date()

            var month = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}`;

            var currentMonthIndex = SIPMonths.indexOf(month)

            var previousMonths = SIPMonths.slice(currentMonthIndex-2,currentMonthIndex+1)
            
            if(currentMonthIndex < 25)
            {
                for(let dts of previousMonths)
                    {
                        var sipPaymentDetails = await sipPaymentModel.findOne({$and:[{sip_payment_month:dts},{sipmember_id:new ObjectId(val._id)}]})
                        
                        if(!sipPaymentDetails)
                        {
                            PenaltyCount = PenaltyCount+1
                        }
                    }
            }
            

            if(PenaltyCount >= 3)
            {
                var updatesipdetails = await sipMemberMgmtModel.updateOne({_id:new ObjectId(val._id)},{$set:{sipmember_status:'Discontinue'}})
                DisconituedMember.push(val)
            }
        }
        SendDiscontuneMemberEmail(['pravin@psoftsolutions.in'],DisconituedMember)
        // res.status(201).json({ message: 'SIP Payment updated successfully',status:true, penaltyAmount});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClientWalletBalance = async (req,res) =>{

    try {

        const client_Id = await sipMemberMgmtModel.findOne({_id:new ObjectId(req.params.member_id)})
        const clientWalletBalance = await cilentWalletModel.findOne({client_id:new ObjectId(client_Id.client_id)}).sort({_id: -1}).limit(1)

        
        if (!clientWalletBalance) {
            return res.status(404).json({ message: 'Entry not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ balance:clientWalletBalance.wallet_balance });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getSipPaymentPreeventcheck = async (req,res)=>{

    try 
    {   
        // console.log(req.query);
        
        const sipmember_id = req.query.sipmember_id
        const sipmonth = req.query.sip_month

        var sipPaymentDetails = await sipPaymentModel.find({$and:[{sipmember_id:new ObjectId(sipmember_id)},{sip_payment_month:sipmonth}]})

        res.status(200).json({msg:'Preevent check called',status:true, sipPaymentDetails:sipPaymentDetails });
    }
    catch(error)
    {
        res.status(400).json({ error: error.message });
    }

}

const ReferencePaymentWallet = async (member_client_id, sipAmt, referedbyclientId, schemeAmount, referenceDate, sipmember_doj, comissionType, sip_payment_receivedDate,comissionWay)=>{
    var sip_amount = 1250;
    var ReferedByClients_Id = [];
    var UpdatedClientId = []
    ReferedByClients_Id.push({referedbyclientId:referedbyclientId,comissionType:comissionType,level:0,comissionWay});

    client_Reference_Payment_Wallet:
    for(let val of ReferedByClients_Id)
    {
        
        var updatedClientId_index = UpdatedClientId.indexOf(val);
        
        if(updatedClientId_index == -1)
        {
            var client_details = await clientModel.findOne({_id:new ObjectId(val.referedbyclientId)})

            var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(client_details.sip_refered_by_clientId)},{reference_category:"SIP"}]}).sort({_id: -1});

            if(client_details.sip_refered_by_clientId != null)
            {
                if(Client_Ref_sch_pay_Dts != null)
                {
                    var comissionType = 'Spot'
                    var comissionWay = "Single"
                    var referenceSchemeDetails = await referenceSchemeModel.findOne({_id:new ObjectId(Client_Ref_sch_pay_Dts.reference_scheme)})
                    if(referenceSchemeDetails.refScheme_comission == "Level" || referenceSchemeDetails.refScheme_comission == "Direct")
                    {
                        comissionType = 'Recurring'
                        if(referenceSchemeDetails.refScheme_comission == "Direct")
                        {
                            comissionWay = "Direct"
                        }  
                    }

                    var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(val.referedbyclientId)},{sip_refered_by:new ObjectId(client_details.sip_refered_by_clientId)},{comission_type:comissionType}]}).sort({_id:-1});

                    if(client_reference_details != null)
                    {
                        ReferedByClients_Id.push({referedbyclientId:client_details.sip_refered_by_clientId,comissionType:client_reference_details.comission_type,level:val.level+1})
                    }
                }  
            }


            // if(schemeAmount == 1000)
            // {
                
            //     var datatoWalletSave = {
            //         client_id: val,
            //         wallet_trans_date: new Date(),
            //         wallet_trans_desc: `Reference Payment for Level ${client_details.sip_reference_level}`,
            //         wallet_credit: bonus_amount,
            //         wallet_debit: 0,
            //         wallet_balance: (client_walletDetails.length>0)?(client_walletDetails[0].wallet_balance + (bonus_amount - 0)):(bonus_amount - 0),
            //     }
    
    
            //     var client_wallet = new cilentWalletModel(datatoWalletSave);
            //     client_wallet.save();
            // }
            if((val.comissionType == 'Spot' && val.level == 0 && referenceDate == sip_payment_receivedDate) || (val.comissionType == 'Recurring' && val.level == client_details.sip_reference_level) || (val.comissionType == 'Recurring' && val.comissionWay == 'Direct'))
            {
                var referencelevelDetails = await referenceLevelModel.findOne({reference_level:val.level+1})

                var bonus_amount = (val.comissionType == 'Spot')?250:(sip_amount * referencelevelDetails.reference_bouns) / 100

                var client_walletDetails = await cilentWalletModel.find({client_id:new ObjectId(val.referedbyclientId)}).limit(1).sort({_id:-1})

                var datatoWalletSave = {
                    client_id: val.referedbyclientId,
                    wallet_trans_date: new Date(),
                    wallet_trans_type:comissionType,
                    wallet_trans_desc: `Reference Payment for ${(val.comissionType == 'Spot')? `Spot Comission`:`Level ${val.level+1}`}`,
                    wallet_credit: bonus_amount,
                    wallet_debit: 0,
                    wallet_balance: (client_walletDetails.length>0)?(client_walletDetails[0].wallet_balance + (bonus_amount - 0)):(bonus_amount - 0),
                }


                var client_wallet = new cilentWalletModel(datatoWalletSave);
                client_wallet.save();

                UpdatedClientId.push(val);

                continue client_Reference_Payment_Wallet;
            }
            
        }
    }
    
    return 'wallet updated';

}

export const SIPPaymentCorrectionAction = async (req, res) => {
    
    var ClientPaymentDetails = [];
    var AllSIPPaymentDetails  = await sipPaymentModel.find().sort({_id:1})//.limit(1)

    for(let Dts of AllSIPPaymentDetails)
    {
        const{sipmember_id, sipmember_name, sip_payment_month, sip_amount, sip_penalty_month, sip_penalty_amount, sip_payment_mode, sip_payment_refno, sip_payment_receivedBy, sip_payment_receivedDate,branch_id} = Dts;   
        
        try {

            var sipMemberDts = await sipMemberMgmtModel.findOne({_id:new ObjectId(sipmember_id)})
            
            var ClientDetails = await clientModel.findOne({_id:new ObjectId(sipMemberDts.client_id)})

            // var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(ClientDetails.sip_refered_by_clientId)},{ref_payment_receivedDate:{$lte:sip_payment_receivedDate}}]}).sort({_id: -1})

            var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(ClientDetails.sip_refered_by_clientId)},{reference_category:"SIP"}]}).sort({_id: -1})
            

            if(ClientDetails.sip_refered_by_clientId != null)
            {
                if(Client_Ref_sch_pay_Dts != null)
                {
                    var comissionType = 'Spot'
                    var comissionWay = "Single"
                    var referenceSchemeDetails = await referenceSchemeModel.findOne({_id:new ObjectId(Client_Ref_sch_pay_Dts.reference_scheme)})
                    if(referenceSchemeDetails.refScheme_comission == "Level" || referenceSchemeDetails.refScheme_comission == "Direct")
                    {
                        comissionType = 'Recurring'
                        if(referenceSchemeDetails.refScheme_comission == "Direct")
                        {
                            comissionWay = "Direct"
                        }  
                    }

                    var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(sipMemberDts.client_id)},{sip_refered_by:new ObjectId(ClientDetails.sip_refered_by_clientId)},{comission_type:comissionType}]}).sort({_id:-1});
                    

                    var newdate = new Date();
                    // newdate.setMinutes(newdate.getMinutes()+330);
                    var todaydate = newdate.getFullYear()+'-'+((newdate.getMonth() + 1)<=9?'0'+(newdate.getMonth() + 1):newdate.getMonth() + 1)+'-'+(newdate.getDate());
                    var from_date = new Date(todaydate);
                    from_date.setHours(5,30,0,0);
                    
                    var ReferedClient_id = []
                    var UpdatedClientId = [] 

                    var sip_refered_by_clientId = ClientDetails.sip_refered_by_clientId;

                    if(!client_reference_details)
                    {

                        var referedClientCount = await sipReferenceModel.find({sip_refered_by:new ObjectId(ClientDetails.sip_refered_by_clientId)})

                        if(referedClientCount.length >= 5)
                        {
                            var GetReferedClientDetails = await clientModel.findOne({_id:new ObjectId(ClientDetails.sip_refered_by_clientId)})

                            if(GetReferedClientDetails.sip_refered_by_clientId != null)
                            {
                                var AllReferedClient =  await sipReferenceModel.find({sip_refered_by:new ObjectId(GetReferedClientDetails.sip_refered_by_clientId)}).sort({_id:1});

                                if(AllReferedClient.length > 0)
                                {
                                    var AllReferedClientId = [];

                                    for(let id of AllReferedClient)
                                    {
                                        if(id.sipmember_clientid != sip_refered_by_clientId)
                                        {
                                            AllReferedClientId.push(id.sipmember_clientid)
                                        }  
                                    }

                                    var countId = await sipReferenceModel.aggregate([
                                        {$match:{sip_refered_by:{$in:AllReferedClientId}}},
                                        {
                                            $group:{
                                                _id:{
                                                    sip_refered_by:"$sip_refered_by"
                                                },
                                                totalCount:{$sum: 1}
                                            }
                                        }
                                    ])

                                    // console.log(countId);

                                    var referenceId = countId.filter((item)=> item.totalCount < 5)

                                    if(referenceId.length > 0)
                                    {
                                        var tempcount = 0
                                        var tempreferenceId
                                        var tempReferDate = null
                                        for(let val of referenceId)
                                        {
                                            
                                            if(val.totalCount > tempcount)
                                            {
                                                tempcount = val.totalCount
                                                tempreferenceId = val._id.sip_refered_by
                                                var referencDetils = await sipReferenceModel.findOne({sipmember_clientid:new ObjectId(val._id.sip_refered_by)})

                                                tempReferDate = referencDetils.sip_referedDate
                                            }
                                            else if(val.totalCount == tempcount)
                                            {
                                                var referencDetils = await sipReferenceModel.findOne({sipmember_clientid:new ObjectId(val._id.sip_refered_by)})

                                                if(tempReferDate != null)
                                                {
                                                    if(referencDetils.sip_referedDate > tempReferDate)
                                                    {
                                                        tempcount = val.totalCount
                                                        tempreferenceId = val._id.sip_refered_by
                                                        tempReferDate = referencDetils.sip_referedDate
                                                    }
                                                }
                                                else
                                                {
                                                    tempcount = val.totalCount
                                                    tempreferenceId = val._id.sip_refered_by
                                                    tempReferDate = referencDetils.sip_referedDate
                                                }   
                                            }

                                        }

                                        sip_refered_by_clientId = tempreferenceId

                                    }
                                }
                            }
                        }

                        var DataToSaveSIPReference = {
                            sipmember_clientid: sipMemberDts.client_id,
                            sip_refered_by: sip_refered_by_clientId,
                            sip_referedDate: sip_payment_receivedDate,
                            comission_type: comissionType,
                            branch_id: branch_id
                        }

                        var ClientLevel = await clientModel.findOne({_id: new ObjectId(sip_refered_by_clientId)})
                        ReferedClient_id.push({referedbyclientId:sip_refered_by_clientId,comissionType:comissionType,level:0})

                        var updateClientDetails = await clientModel.updateOne({_id:new ObjectId(sipMemberDts.client_id)},{$set:{sip_refered_by_clientId:sip_refered_by_clientId}})
                        const sip_reference = new sipReferenceModel(DataToSaveSIPReference);
                        await sip_reference.save();
                    }

                    // remove wallet code and level upgrade code  

                    var client_refe_wallet = await ReferencePaymentWalletCorrection(sipMemberDts.client_id,sip_amount,sip_refered_by_clientId,Client_Ref_sch_pay_Dts.reference_scheme_amount,(!client_reference_details)?sip_payment_receivedDate:client_reference_details.sip_referedDate,sipMemberDts.sipmember_doj,comissionType,sip_payment_receivedDate,comissionWay)
                      

                    ReferenceByLoop:
                    for(let val of ReferedClient_id)
                    {
                        
                        var updatedClient_index = UpdatedClientId.indexOf(val)

                        if(updatedClient_index == -1)
                        {
                            var samelevelCount = 0
                            var ReferedByClient_Id = await clientModel.findOne({_id: new ObjectId(val.referedbyclientId)})
                            
                            var client_referenceDetails = await sipReferenceModel.find({sip_refered_by: new ObjectId(val.referedbyclientId)})

                            if(val.comissionType == 'Recurring')
                            {
                                for(let client of client_referenceDetails)
                                {
                                    let client_dts = await clientModel.findOne({$and:[{_id: new ObjectId(client.sipmember_clientid)},{sip_reference_level:{$gte:ReferedByClient_Id.sip_reference_level}}]})

                                    // console.log('114',client_dts);
                                        
                                    if(client_dts != null)
                                    {
                                        samelevelCount = samelevelCount + 1
                                    }
                                }

                                // console.log(samelevelCount);
                                

                                if(samelevelCount  >= 5)
                                {
                                    if(ReferedByClient_Id.sip_reference_level <= 6)
                                    {
                                        let client_update_reference_level = await clientModel.updateOne(
                                        { _id: new ObjectId(val.referedbyclientId) },
                                        {
                                            $set: {
                                                sip_reference_level: ReferedByClient_Id.sip_reference_level+1,
                                            },
                                        })   
                                    }          
                                }
                            }

                            UpdatedClientId.push(val)
                            if(ReferedByClient_Id.sip_refered_by_clientId != null)
                            {
                                let client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(val.referedbyclientId)},{sip_refered_by:new ObjectId(ReferedByClient_Id.sip_refered_by_clientId)}]}).sort({_id:-1});

                                if(client_reference_details != null)
                                {
                                    ReferedClient_id.push({referedbyclientId:ReferedByClient_Id.sip_refered_by_clientId,comissionType:client_reference_details.comission_type,level:val.level+1})
                                }

                                continue ReferenceByLoop; 
                            }
                        }    
                    }
                }   
            }

            

            // res.status(201).json({ message: 'SIP Payment added successfully',status:true ,sipPayment,sipPaymentReciept });
            // ClientPaymentDetails.push({ message: 'SIP Payment added successfully',status:true ,Dts })
            // console.log({ message: 'SIP Payment added successfully',status:true ,Dts });
            // return

        } catch (error) {
            // res.status(400).json({ error: error.message });
            ClientPaymentDetails.push({ error: error.message,Dts })
            // console.log({ error: error.message,Dts });
        }
        
    }

    res.status(201).json({ClientPaymentDetails});
    
};

const ReferencePaymentWalletCorrection = async (member_client_id, sipAmt, referedbyclientId, schemeAmount, referenceDate, sipmember_doj, comissionType, sip_payment_receivedDate,comissionWay)=>{
    
    var sip_amount = 1250;
    var ReferedByClients_Id = [];
    var UpdatedClientId = []
    ReferedByClients_Id.push({referedbyclientId:referedbyclientId,comissionType:comissionType,level:0,comissionWay});

    client_Reference_Payment_Wallet:
    for(let val of ReferedByClients_Id)
    {
        // console.log(member_client_id);
        
        // if(val.referedbyclientId == "670e60ed6fa7c68051ad9651" || val.referedbyclientId == "67124c588bfbd156f502b7fd")
        // {
        //     console.log(val);
        // }
        
        
        var updatedClientId_index = UpdatedClientId.indexOf(val);
        
        if(updatedClientId_index == -1)
        {
            var client_details = await clientModel.findOne({_id:new ObjectId(val.referedbyclientId)});

            // var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(client_details.sip_refered_by_clientId)},{ref_payment_receivedDate:{$lte:sip_payment_receivedDate}}]}).sort({_id: -1});

            var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(client_details.sip_refered_by_clientId)},{reference_category:"SIP"}]}).sort({_id: -1});


            if(client_details.sip_refered_by_clientId != null)
            {

                if(Client_Ref_sch_pay_Dts != null)
                {
                    var comissionType = 'Spot'
                    var comissionWay = "Single"
                    var referenceSchemeDetails = await referenceSchemeModel.findOne({_id:new ObjectId(Client_Ref_sch_pay_Dts.reference_scheme)})
                    if(referenceSchemeDetails.refScheme_comission == "Level" || referenceSchemeDetails.refScheme_comission == "Direct")
                    {
                        comissionType = 'Recurring'
                        if(referenceSchemeDetails.refScheme_comission == "Direct")
                        {
                            comissionWay = "Direct"
                        }  
                    }


                    var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(val.referedbyclientId)},{sip_refered_by:new ObjectId(client_details.sip_refered_by_clientId)},{comission_type:comissionType}]}).sort({_id:-1});

                    if(client_reference_details != null)
                    {
                        ReferedByClients_Id.push({referedbyclientId:client_details.sip_refered_by_clientId,comissionType:client_reference_details.comission_type,level:val.level+1,comissionWay})
                    }
                }
            }


            // if(schemeAmount == 1000)
            // {
                
            //     var datatoWalletSave = {
            //         client_id: val,
            //         wallet_trans_date: new Date(),
            //         wallet_trans_desc: `Reference Payment for Level ${client_details.sip_reference_level}`,
            //         wallet_credit: bonus_amount,
            //         wallet_debit: 0,
            //         wallet_balance: (client_walletDetails.length>0)?(client_walletDetails[0].wallet_balance + (bonus_amount - 0)):(bonus_amount - 0),
            //     }
    
    
            //     var client_wallet = new cilentWalletModel(datatoWalletSave);
            //     client_wallet.save();
            // }

            
            if((val.comissionType == 'Spot' && val.level == 0 && referenceDate == sip_payment_receivedDate) || (val.comissionType == 'Recurring' && val.level == client_details.sip_reference_level) || (val.comissionType == 'Recurring' && val.comissionWay == 'Direct'))
            {
                var referencelevelDetails = await referenceLevelModel.findOne({reference_level:val.level+1})

                var bonus_amount = (val.comissionType == 'Spot')?250:(sip_amount * referencelevelDetails.reference_bouns) / 100

                var client_walletDetails = await cilentWalletModel.find({client_id:new ObjectId(val.referedbyclientId)}).limit(1).sort({_id:-1})

                var datatoWalletSave = {
                    client_id: val.referedbyclientId,
                    wallet_trans_date: sip_payment_receivedDate,
                    wallet_trans_type:val.comissionType,
                    wallet_trans_desc: `Reference Payment for ${(val.comissionType == 'Spot')? `Spot Comission`:`Level ${val.level+1}`}`,
                    wallet_credit: bonus_amount,
                    wallet_debit: 0,
                    wallet_balance: (client_walletDetails.length>0)?(client_walletDetails[0].wallet_balance + (bonus_amount - 0)):(bonus_amount - 0),
                }


                var client_wallet = new cilentWalletModel(datatoWalletSave);
                client_wallet.save();

                UpdatedClientId.push(val);

                continue client_Reference_Payment_Wallet;
            }
            
        }
    }
    
    return 'wallet updated';

}

export const SIPDataClearAction = async (req, res) => {
    
    var client_Id = [
        new ObjectId("670e60ed6fa7c68051ad9651"),
        new ObjectId("670e66716fa7c68051ad967d"),
        new ObjectId("670f5ced38f3dad7f7ffb5ad"),
        new ObjectId("6762c3dc6536be3e671a1845"),
        new ObjectId("670f5a6338f3dad7f7ffb58d"),
        new ObjectId("670f5ba638f3dad7f7ffb59a"),
        new ObjectId("670e5c526fa7c68051ad9610"),
        new ObjectId("670f5d3438f3dad7f7ffb5b9"),
        new ObjectId("671116029e1325864dc67fe3"),
        new ObjectId("67124c588bfbd156f502b7fd"),
        new ObjectId("670f601338f3dad7f7ffb5ec"),
        new ObjectId("670f622938f3dad7f7ffb62a"),
        new ObjectId("6717a07ba7429a884473c20e"),
        new ObjectId("67189980eacfd86c74706a15"),
        new ObjectId("67602fdfdd469e1f07a6a40d"),
        new ObjectId("67602fdfdd469e1f07a6a411"),
        new ObjectId("67602fe0dd469e1f07a6a465"),
        new ObjectId("671781bea7429a884473be72"),
        new ObjectId("6718ae8beacfd86c7470711c"),
        new ObjectId("6711166d9e1325864dc67fe9"),
        new ObjectId("67176feca7429a884473bae0"),
        new ObjectId("67126ed38bfbd156f502bad5"),
        new ObjectId("67124edc8bfbd156f502b81f"),
        new ObjectId("67188fe2eacfd86c74706836"),
        new ObjectId("670f898338f3dad7f7ffb83c"),
        new ObjectId("670f89f338f3dad7f7ffb848"),
        new ObjectId("670f8a9438f3dad7f7ffb858"),
        new ObjectId("670f8b6438f3dad7f7ffb86d"),
        new ObjectId("67602fdfdd469e1f07a6a415"),
        new ObjectId("670f9bfc38f3dad7f7ffb8f5"),
        new ObjectId("670f9c5a38f3dad7f7ffb8fb"),
        new ObjectId("670f9eba38f3dad7f7ffb90b"),
        new ObjectId("670f9f0f38f3dad7f7ffb911"),
        new ObjectId("6718adf0eacfd86c747070f2"),
        new ObjectId("67179c58a7429a884473c111"),
        new ObjectId("6718ad6deacfd86c747070d6")
    ]
    var spi_Id = [];
    var sip_Payment_Id = []

    var sipmemberDetails = await sipMemberMgmtModel.find({client_id:{$in:client_Id}})
    
    for(let val of sipmemberDetails)
    {
        spi_Id.push(val._id)
    }

    var sipPaymentDetails = await sipPaymentModel.find({sipmember_id:{$in:spi_Id}})

    for(let val of sipPaymentDetails)
    {
        sip_Payment_Id.push(val._id)
    }

    var clientDelete = await clientModel.deleteMany({_id:{$nin:client_Id}})
    var sipMemberDelete = await sipMemberMgmtModel.deleteMany({_id:{$nin:spi_Id}})
    var sipPaymentDelete = await sipPaymentModel.deleteMany({_id:{$nin:sip_Payment_Id}})



    res.status(200).json({msg:"Proceed Successfully",client_Id,count1:client_Id.length,spi_Id,count2:spi_Id.length,sip_Payment_Id,count3:sip_Payment_Id.length})
};
