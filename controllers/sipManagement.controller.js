import mongoose from "mongoose";
import multer from 'multer';
import sipMemberMgmtModel from "../models/sipManagerment.model.js";

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
                const{client_id,sipmember_name,sipmember_bank_name,sipmember_account_number,sipmember_ifsc_code,sipmember_upi_id,sipmember_doj,sipmember_maturity_date,sipmember_nominee_name,sipmember_nominee_age,sipmember_nominee_relation,sipmember_nominee_mobile,sipmember_nominee_pancard,sipmember_nominee_addharcard,sipmemberblock_status,branch_id} = req.body;
                
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
                    sipmember_nominee_age: sipmember_nominee_age,
                    sipmember_nominee_relation: sipmember_nominee_relation,
                    sipmember_nominee_mobile: sipmember_nominee_mobile,
                    sipmember_nominee_pancard: req.files.sipmember_nominee_pancard[0].filename,
                    sipmember_nominee_addharcard: req.files.sipmember_nominee_addharcard[0].filename,
                    sipmemberblock_status:sipmemberblock_status,
                    branch_id:branch_id
                }
                

                const sip_management = new sipMemberMgmtModel(sip_DataToSave);
                await sip_management.save();
                
                res.status(201).json({ message: 'SIP Member added successfully',status:true ,sip_management});
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
        var staff = await sipMemberMgmtModel.aggregate([
            {$match:{_id:new ObjectId(req.params.sip_id)}},
          ])
        if (staff.length == 0) {
            return res.status(404).json({ message: 'SIP Member not found',status:false });
        }
        res.status(200).json({ staff });
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
        var staff = await sipMemberMgmtModel.aggregate([
            {
                $project:{
                  _id:1,
                  sipmember_id:1,
                  sipmember_name: 1,
                  sipmember_doj: 1,
                  sipmember_maturity_date: 1,
                  sipmember_nominee_name: 1,
                  sipmember_nominee_age:1,
                  sipmember_nominee_relation:1,
                  sipmember_nominee_mobile:1,
                }
              }
        ])
        
        .skip(skip).limit(limit)


        if (!staff) {
            return res.status(404).json({ message: 'SIP Members not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ staff });
        
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
                const{sipmember_id,client_id,sipmember_name,sipmember_bank_name,sipmember_account_number,sipmember_ifsc_code,sipmember_upi_id,sipmember_doj,sipmember_maturity_date,sipmember_nominee_name,sipmember_nominee_age,sipmember_nominee_relation,sipmember_nominee_mobile,sipmember_nominee_pancard,sipmember_nominee_addharcard,sipmemberblock_status,branch_id} = req.body;

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
                    sipmemberblock_status:sipmemberblock_status,
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
