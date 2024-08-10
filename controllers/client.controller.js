import mongoose from "mongoose";
import multer from 'multer';
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
    { name: 'client_pancard', maxCount: 1 }, // Single file for 'profilePic' field
    { name: 'client_addharcard', maxCount: 1 }   // Multiple files for 'documents' field
  ]);

export const createClientAction = async (req, res) => {   
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
                // console.log(req.body);
                // var personalDetails = req.body.personalDetails
                const{client_name, client_dob, client_mobile_number, client_emailId, client_gender, client_pancard, client_addharcard,client_postaladdress,client_landmark,branch_id} = req.body;

                var clientDetails = await clientModel.find();

                let ActualId = 0
                let NewClient_Id = ''
                if(clientDetails.length > 0)
                {
                    for(let val of clientDetails)
                    {
                        const splitNumbers = val.client_id.split('-').map((num) => parseFloat(num.trim()));
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
                    NewClient_Id = 'CL-'+ActualId.toString()
                }
                else
                {
                    ActualId = ActualId+1;
                    NewClient_Id = 'CL-'+ActualId.toString()
                }
                
                var client_DataToSave = {
                    client_id: NewClient_Id,
                    client_name: client_name,
                    client_dob: new Date(client_dob),
                    client_mobile_number: client_mobile_number,
                    client_emailId: client_emailId,
                    client_gender: client_gender,
                    client_pancard: req.files.client_pancard[0].filename,
                    client_addharcard: req.files.client_addharcard[0].filename,
                    client_postaladdress: client_postaladdress,
                    client_landmark: client_landmark,
                    branch_id:branch_id
                }
                console.log(client_DataToSave);
                

                const client = new clientModel(client_DataToSave);
                await client.save();

                
                res.status(201).json({ message: 'Client added successfully',status:true ,client});
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClientByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var client = await clientModel.aggregate([
            {$match:{_id:new ObjectId(req.params.client_id)}},
          ])
        if (client.length == 0) {
            return res.status(404).json({ message: 'Client not found',status:false });
        }
        res.status(200).json({ client });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClientAction = async (req, res) => {
    try {
        const pageNumber = req.query.page || 1;
        const branch_id = req.query.branch_id || '0';
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        let client 
        
        if(branch_id == '0')
        {
            client = await clientModel.find().skip(skip).limit(limit)
        }
        else
        {
            client = await clientModel.find({branch_id:new ObjectId(branch_id)}).skip(skip).limit(limit)

        }
        if (!client) {
            return res.status(404).json({ message: 'Client not found',status:false });
        }
        // console.log(client1);
        res.status(200).json({ client });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const DeleteClientAction = async (req, res) => {
    try {

        var client = await clientModel.deleteOne({_id:new ObjectId(req.params.client_id)})
        res.status(201).json({ message: 'Client deleted successfully',status:true, client });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const UpdateClientAction = async (req, res) => {
    
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

            const{client_id, client_name, client_dob, client_mobile_number, client_emailId, client_gender, client_pancard, client_addharcard,client_postaladdress,client_landmark,branch_id} = req.body; 

            var client_record = await clientModel.find({_id:new ObjectId(req.params.client_id)});

            let clientPancard = client_record[0].client_pancard
            let clientAddharCard = client_record[0].client_addharcard

            if(req.files.client_pancard != undefined)
            {
                clientPancard = req.files.client_pancard[0].filename
            }

            if(req.files.client_addharcard != undefined)
            {
                clientAddharCard = req.files.client_addharcard[0].filename
            }

            var DataToSave = {
                client_id: client_id,
                client_name: client_name,
                client_dob: new Date(client_dob),
                client_mobile_number: client_mobile_number,
                client_emailId: client_emailId,
                client_gender: client_gender,
                client_pancard: clientPancard,
                client_addharcard: clientAddharCard,
                client_postaladdress: client_postaladdress,
                client_landmark: client_landmark,
                branch_id:branch_id
            }

        const client = await clientModel.findByIdAndUpdate({_id:new ObjectId(req.params.client_id)},DataToSave);
        // await staff.save();
        res.status(201).json({ message: 'Client Updated successfully',status:true, client });
        }})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClientIdByBranchIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var clients = await clientModel.aggregate([
            {$match:{branch_id:new ObjectId(req.params.branch_id)}},
            {$project:{
                _id:1,
                client_id:1,
                client_name:1
            }}
          ])
        if (clients.length == 0) {
            return res.status(404).json({ message: 'Clients not found',status:false });
        }
        res.status(200).json({ clients });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};