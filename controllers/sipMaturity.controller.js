import mongoose from "mongoose";
import sipMaturityModel from "../models/sipMaturity.model.js";
import multer from 'multer';
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import clientModel from "../models/client.model.js";

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

                const{sipmaturity_receiptno, client_id, sipmember_id, sipmember_name, sip_maturity_amount, sip_payment_mode, sip_payment_paidBy, sip_payment_paidDate,sip_maturity_doc,branch_id} = req.body;   

                    var DataToSave = {
                        sipmaturity_receiptno: sipmaturity_receiptno,
                        client_id: client_id,
                        sipmember_id: sipmember_id,
                        sipmember_name: sipmember_name,
                        sip_maturity_amount: sip_maturity_amount,
                        sip_payment_mode: sip_payment_mode,
                        sip_payment_paidBy: sip_payment_paidBy,
                        sip_payment_paidDate: sip_payment_paidDate,
                        sip_maturity_doc: req.files.sip_maturity_doc[0].filename,
                        branch_id:branch_id
                    }
                    const sipMPayment = new sipMaturityModel(DataToSave);
                    await sipMPayment.save();

                    res.status(201).json({ message: 'Payment added successfully',status:true ,sipMPayment });
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
        if (sipPayment.length == 0) {
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
        var sipMPayment = await sipMaturityModel.find().skip(skip).limit(limit)
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
        res.status(201).json({ message: 'Payment deleted successfully',status:true, sipMPayment });

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
                        sip_maturity_amount: sip_maturity_amount,
                        sip_payment_mode: sip_payment_mode,
                        sip_payment_paidBy: sip_payment_paidBy,
                        sip_payment_paidDate: sip_payment_paidDate,
                        sip_maturity_doc: sipMDocument,
                        branch_id:branch_id
                    }


                    const sipMPayment = await sipMaturityModel.findByIdAndUpdate({_id:new ObjectId(req.params.maturity_id)},DataToSave);

                    res.status(201).json({ message: 'Payment updated successfully',status:true ,sipMPayment });
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



