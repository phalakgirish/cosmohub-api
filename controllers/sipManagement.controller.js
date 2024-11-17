import mongoose from "mongoose";
import multer from 'multer';
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import clientModel from "../models/client.model.js";
import sipReferenceModel from "../models/sipReference.model.js";
import referenceLevelModel from "../models/referenceLevel.model.js";
import cilentWalletModel from "../models/clientWallet.model.js";
import referenceSchemePaymentModel from "../models/referenceSchemePay.model.js";

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
    { name: 'sipmember_nominee_pancard', maxCount: 1 }, // Single file for 'profilePic' field
    { name: 'sipmember_nominee_addharcard', maxCount: 1 }   // Multiple files for 'documents' field
  ]);

//   const upload = multer({ storage: storage }).single('staff_pancard');

export const createSipMemberAction = async (req, res) => {   
    try
    {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err);
              } else if (err) {
                // An unknown error occurred when uploading.
                console.log(err);
              } 
              else{
                const{client_id,sipmember_name,sipmember_bank_name,sipmember_account_number,sipmember_ifsc_code,sipmember_upi_id,sipmember_doj,sipmember_maturity_date,sipmember_nominee_name,sipmember_nominee_age,sipmember_nominee_relation,sipmember_nominee_mobile,sipmember_nominee_pancard,sipmember_nominee_addharcard,sipmember_status,branch_id} = req.body;
                // console.log(req.files);
                
                var sipDetails = await sipMemberMgmtModel.find();

                let ActualId = 0
                let NewSip_Id = ''
                if(sipDetails.length > 0)
                {
                    for(let val of sipDetails)
                    {
                        const splitNumbers = val.sipmember_id.split('-').map((num) => parseFloat(num.trim()));
                        // console.log(splitNumbers);
                        if(splitNumbers[1] > ActualId)
                        {
                            ActualId = splitNumbers[1];
                        }
                    }
                }

                if(ActualId == 0)
                {
                    ActualId = 1001;
                    NewSip_Id = 'SIP-'+ActualId.toString()
                }
                else
                {
                    ActualId = ActualId+1;
                    NewSip_Id = 'SIP-'+ActualId.toString()
                }

                var ClientDetails = await clientModel.findOne({_id:new ObjectId(client_id)})

                var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({client_id:new ObjectId(ClientDetails.sip_refered_by_clientId)})
                

                if(ClientDetails.sip_refered_by_clientId != null)
                {
                    if(Client_Ref_sch_pay_Dts)
                    {
                        var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(client_id)},{sip_refered_by:new ObjectId(ClientDetails.sip_refered_by_clientId)}]})
                    
                        if(!client_reference_details)
                        {
                            var ReferedClient_id = []
                            var UpdatedClientId = []
                            var DataToSaveSIPReference = {
                                sipmember_clientid: client_id,
                                sip_refered_by: ClientDetails.sip_refered_by_clientId,
                                sip_referedDate: new Date(),
                                branch_id: branch_id
                            }
                            ReferedClient_id.push(ClientDetails.sip_refered_by_clientId)
                            const sip_reference = new sipReferenceModel(DataToSaveSIPReference);
                            await sip_reference.save();

                            var client_refe_wallet = await ReferencePaymentWallet(client_id,ClientDetails.sip_refered_by_clientId,Client_Ref_sch_pay_Dts.reference_scheme_amount)
                            

                            ReferenceByLoop:
                            for(let val of ReferedClient_id)
                            {

                                
                                var updatedClient_index = UpdatedClientId.indexOf(val)

                                
                                if(updatedClient_index == -1)
                                {
                                    var samelevelCount = 0
                                    var ReferedByClient_Id = await clientModel.findOne({_id: new ObjectId(val)})
                                    
                                    var client_referenceDetails = await sipReferenceModel.find({sip_refered_by: new ObjectId(val)})

                                    for(let client of client_referenceDetails)
                                    {
                                        let client_dts = await clientModel.findOne({$and:[{_id: new ObjectId(client.sipmember_clientid)},{sip_reference_level:ReferedByClient_Id.sip_reference_level}]})

                                        // console.log('114',client_dts);
                                        
                                        if(client_dts)
                                        {
                                            samelevelCount = samelevelCount + 1
                                        }
                                    }

                                    if(samelevelCount  == 5)
                                    {
                                        if(ReferedByClient_Id.sip_reference_level <= 6)
                                        {
                                            var client_update_reference_level = await clientModel.updateOne(
                                            { _id: new ObjectId(val) },
                                                {
                                                $set: {
                                                    sip_reference_level: ReferedByClient_Id.sip_reference_level+1,
                                                },
                                                })
                                            UpdatedClientId.push(val)
                                                
                                            if(ReferedByClient_Id.sip_refered_by_clientId != null)
                                            {
                                                ReferedClient_id.push(ReferedByClient_Id.sip_refered_by_clientId)
                                            }
                                        }   
                                        continue ReferenceByLoop; 
                                    }      
                                }  
                            }   
                        }
                    }   
                }

                var sip_DataToSave = {
                    sipmember_id: NewSip_Id,
                    client_id:client_id,
                    sipmember_name: sipmember_name,
                    sipmember_bank_name: sipmember_bank_name,
                    sipmember_account_number: sipmember_account_number,
                    sipmember_ifsc_code: sipmember_ifsc_code,
                    sipmember_upi_id: sipmember_upi_id,
                    sipmember_doj: new Date(sipmember_doj),
                    sipmember_maturity_date: new Date(sipmember_maturity_date),
                    sipmember_nominee_name: sipmember_nominee_name,
                    sipmember_nominee_age: parseInt(sipmember_nominee_age),
                    sipmember_nominee_relation: sipmember_nominee_relation,
                    sipmember_nominee_mobile: sipmember_nominee_mobile,
                    sipmember_nominee_pancard: req.files.sipmember_nominee_pancard[0].filename,
                    sipmember_nominee_addharcard: req.files.sipmember_nominee_addharcard[0].filename,
                    sipmember_status:sipmember_status,
                    branch_id:branch_id
                }

                

                const sip_management = new sipMemberMgmtModel(sip_DataToSave);
                await sip_management.save();
                
                res.status(200).json({ message: 'SIP Member added successfully',status:true ,sip_management});
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message, status:false });
    }
};

export const getSipMemberByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var sip_member = await sipMemberMgmtModel.aggregate([
            {$match:{_id:new ObjectId(req.params.sip_id)}},
          ])
        if (sip_member.length == 0) {
            return res.status(404).json({ message: 'SIP Member not found',status:false });
        }
        res.status(200).json({ sip_member });
    } catch (error) {
        res.status(400).json({ error: error.message,status:false });
    }
};

export const getSipMembersAction = async (req, res) => {
    try {
        // const staff = await staffModel.find();
        // const staff1 = await Shift.find();
        const pageNumber = req.query.page || 1;
        const branch_id = req.query.branch_id || '0';
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var sip_member = await sipMemberMgmtModel.aggregate([
            {
                $lookup:{
                        from: "clients",
                        localField: "client_id",
                        foreignField: "_id",
                        as: "clientId",
                }
            },
            {
                $project:{
                  _id:1,
                  sipmember_id:1,
                  client_id:{ $arrayElemAt: ["$clientId.client_id", 0] },
                  sipmember_name: 1,
                  sipmember_doj: 1,
                  sipmember_maturity_date: 1,
                  sipmember_nominee_name: 1,
                  sipmember_nominee_age:1,
                  sipmember_nominee_relation:1,
                  sipmember_nominee_mobile:1,
                  sipmember_status:1
                }
              }
        ])
        
        //.skip(skip)//.limit(limit);
        
        if (!sip_member) {
            return res.status(404).json({ message: 'SIP Members not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sip_member });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const DeleteSipMemberAction = async (req, res) => {
    try {
        var sip_member = await sipMemberMgmtModel.deleteOne({_id:new ObjectId(req.params.sip_id)})
        res.status(201).json({ message: 'SIP Member Deleted successfully',status:true, sip_member });
    } catch (error) {
        res.status(400).json({ error: error.message, status:false });
    }
};

export const UpdateSipMemberAction = async (req, res) => { 
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
                const{sipmember_id,client_id,sipmember_name,sipmember_bank_name,sipmember_account_number,sipmember_ifsc_code,sipmember_upi_id,sipmember_doj,sipmember_maturity_date,sipmember_nominee_name,sipmember_nominee_age,sipmember_nominee_relation,sipmember_nominee_mobile,sipmember_nominee_pancard,sipmember_nominee_addharcard,sipmember_status,branch_id} = req.body;

                const sipMember_record = await sipMemberMgmtModel.find({_id:req.params.sip_id});
                
                let sipPancard = sipMember_record[0].sipmember_nominee_pancard
                let sipAddharCard = sipMember_record[0].sipmember_nominee_addharcard

                if(req.files.sipmember_nominee_pancard != undefined)
                {
                    sipPancard = req.files.sipmember_nominee_pancard[0].filename
                }

                if(req.files.sipmember_nominee_addharcard != undefined)
                {
                    sipAddharCard = req.files.sipmember_nominee_addharcard[0].filename
                }
                
                var sip_DataToSave = {
                    sipmember_id: sipmember_id,
                    client_id:client_id,
                    sipmember_name: sipmember_name,
                    sipmember_bank_name: sipmember_bank_name,
                    sipmember_account_number: sipmember_account_number,
                    sipmember_ifsc_code: sipmember_ifsc_code,
                    sipmember_upi_id: sipmember_upi_id,
                    sipmember_doj:  new Date(sipmember_doj),
                    sipmember_maturity_date:  new Date(sipmember_maturity_date),
                    sipmember_nominee_name: sipmember_nominee_name,
                    sipmember_nominee_age: sipmember_nominee_age,
                    sipmember_nominee_relation: sipmember_nominee_relation,
                    sipmember_nominee_mobile: sipmember_nominee_mobile,
                    sipmember_nominee_pancard: sipPancard,
                    sipmember_nominee_addharcard: sipAddharCard,
                    sipmember_status:sipmember_status,
                    branch_id:branch_id
                }
                


                const sip_management = await sipMemberMgmtModel.findByIdAndUpdate({_id:new ObjectId(req.params.sip_id)},sip_DataToSave);
                // await staff.save();
                res.status(201).json({ message: 'Staff Member updated successfully',status:true, sip_management });
            }
        });

        
    } catch (error) {
        res.status(400).json({ error: error.message,status:false });
    }
};

export const getSipMemberByClientIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var SipMember = await sipMemberMgmtModel.aggregate([
            {$match:{$and:[{client_id:new ObjectId(req.params.client_id)},{sipmemberblock_status:false}]}},
            {$project:{
                _id:1,
                sipmember_id:1,
                sipmember_name:1
            }}
          ])
        if (SipMember.length == 0) {
            return res.status(404).json({ message: 'SIP Member not found',status:false });
        }
        res.status(200).json({ SipMember });
    } catch (error) {
        res.status(400).json({ error: error.message,status:false });
    }
};

export const getSipMemberByBranchIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var SipMember = await sipMemberMgmtModel.aggregate([
            {$match:{$and:[{branch_id_id:new ObjectId(req.params.branch_id)},{sipmemberblock_status:false}]}},
            {$project:{
                _id:1,
                sipmember_id:1,
                sipmember_name:1
            }}
          ])
        if (SipMember.length == 0) {
            return res.status(404).json({ message: 'SIP Member not found',status:false });
        }
        res.status(200).json({ SipMember });
    } catch (error) {
        res.status(400).json({ error: error.message,status:false });
    }
};

export const createSipMemberReplicaByIdAction = async (req, res) => {

    
    try {
        
        var sip_member = await sipMemberMgmtModel.aggregate([
            {$match:{_id:new ObjectId(req.params.sip_id)}},
          ])

        if (sip_member.length == 0) {
            return res.status(404).json({ message: 'SIP Member not found',status:false });
        }
        
        
        let sipemberDetails = sip_member[0]
        var sipDetails = await sipMemberMgmtModel.find();

        let ActualId = 0
        let NewSip_Id = ''
        if(sipDetails.length > 0)
        {
            for(let val of sipDetails)
            {
                const splitNumbers = val.sipmember_id.split('-').map((num) => parseFloat(num.trim()));
                // console.log(splitNumbers);
                if(splitNumbers[1] > ActualId)
                {
                    ActualId = splitNumbers[1];
                }
            }
        }

        if(ActualId == 0)
        {
            ActualId = 1001;
            NewSip_Id = 'SIP-'+ActualId.toString()
        }
        else
        {
            ActualId = ActualId+1;
            NewSip_Id = 'SIP-'+ActualId.toString()
        }

        
        var today = new Date()
        today.setMinutes(today.getMinutes()+330);
        today.setUTCHours(0,0,0,0);
        var JoiningDate = today.toISOString();

        today.setMonth(today.getMonth()+30);
        var MaturityDate = today.toISOString();

        // console.log(sipemberDetails);  
        
        var sip_DataToSave = {
            sipmember_id: NewSip_Id,
            client_id:sipemberDetails.client_id,
            sipmember_name: sipemberDetails.sipmember_name,
            sipmember_bank_name: sipemberDetails.sipmember_bank_name,
            sipmember_account_number: sipemberDetails.sipmember_account_number,
            sipmember_ifsc_code: sipemberDetails.sipmember_ifsc_code,
            sipmember_upi_id: sipemberDetails.sipmember_upi_id,
            sipmember_doj: new Date(JoiningDate),
            sipmember_maturity_date: new Date(MaturityDate),
            sipmember_nominee_name: sipemberDetails.sipmember_nominee_name,
            sipmember_nominee_age: parseInt(sipemberDetails.sipmember_nominee_age),
            sipmember_nominee_relation: sipemberDetails.sipmember_nominee_relation,
            sipmember_nominee_mobile: sipemberDetails.sipmember_nominee_mobile,
            sipmember_nominee_pancard: sipemberDetails.sipmember_nominee_pancard,
            sipmember_nominee_addharcard: sipemberDetails.sipmember_nominee_addharcard,
            sipmember_status:'Continue',
            branch_id:sipemberDetails.branch_id
        }

        const sip_management = new sipMemberMgmtModel(sip_DataToSave);
        await sip_management.save();


        
        res.status(200).json({ message:'SIP Member Added Succesfully, with SIP Id: '+sip_management.sipmember_id, status:true});
    } catch (error) {
        res.status(400).json({ error: error.message,status:false });
    }
};

const ReferencePaymentWallet = async (member_client_id,referedbyclientId,schemeAmount)=>{
    var sip_amount = 1250;
    var ReferedByClients_Id = [];
    var UpdatedClientId = []
    ReferedByClients_Id.push(referedbyclientId);

    client_Reference_Payment_Wallet:
    for(let val of ReferedByClients_Id)
    {
        
        var updatedClientId_index = UpdatedClientId.indexOf(val);
        
        if(updatedClientId_index == -1)
        {
            var client_details = await clientModel.findOne({_id:new ObjectId(val)})
            if(client_details.sip_refered_by_clientId != null)
            {
                ReferedByClients_Id.push(client_details.sip_refered_by_clientId)
            }
            
            var referencelevelDetails = await referenceLevelModel.findOne({reference_level:client_details.sip_reference_level+1})

            var bonus_amount = (sip_amount * referencelevelDetails.reference_bouns) / 100

            var client_walletDetails = await cilentWalletModel.find({client_id:new ObjectId(val)}).limit(1).sort({_id:-1})

            var datatoWalletSave = {
                client_id: val,
                wallet_trans_date: new Date(),
                wallet_trans_desc: `Reference Payment for Level ${client_details.sip_reference_level}`,
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
    
    return 'wallet updated';

}


