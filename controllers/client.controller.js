import mongoose from "mongoose";
import multer from 'multer';
import clientModel from "../models/client.model.js";
import branchModel from "../models/branch.model.js";
import validator from "validator";

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
    { name: 'client_otherdocs', maxCount: 1 }, // Single file for 'profilePic' field
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
                console.log(req.body);
                // var personalDetails = req.body.personalDetails
                const{client_name, client_dob, client_mobile_number, client_emailId, client_gender, client_otherdocs, client_addharcard,
                    client_aadhaar_number,client_postaladdress,client_landmark,sip_refered_by_clientId,sip_reference_level,client_country,client_state,client_city,client_status,branch_id} = req.body;

                var clientDetails = await clientModel.find({branch_id:new ObjectId(branch_id)});

                var branchDetails = await branchModel.find({_id:new ObjectId(branch_id)})

                var Branchcode = branchDetails[0].branch_code

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
                    NewClient_Id = Branchcode+'-'+ActualId.toString()
                }
                else
                {
                    ActualId = ActualId+1;
                    NewClient_Id = Branchcode+'-'+ActualId.toString()
                }
                
                
                var client_DataToSave = {
                    client_id: NewClient_Id,
                    client_name: client_name,
                    client_dob: new Date(client_dob),
                    client_mobile_number: client_mobile_number,
                    client_emailId: (client_emailId== 'undefined' || client_emailId== '')?null:client_emailId,
                    client_gender: client_gender,
                    client_otherdocs: (req.files.client_otherdocs == undefined || req.files.client_otherdocs == '') ? null : req.files.client_otherdocs[0].filename,
                    client_addharcard: req.files.client_addharcard[0].filename,
                    client_aadhaar_number: client_aadhaar_number,
                    client_postaladdress: client_postaladdress,
                    client_landmark: (client_landmark== 'undefined' || client_landmark== '')?null:client_landmark,
                    sip_refered_by_clientId:(sip_refered_by_clientId == 'null' || sip_refered_by_clientId == '')?null:sip_refered_by_clientId,
                    sip_reference_level:Number(sip_reference_level),
                    client_country: client_country,
                    client_state: client_state,
                    client_city: client_city,
                    client_status:client_status,
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
            client = await clientModel.find() //.skip(skip).limit(limit)
        }
        else
        {
            client = await clientModel.find({branch_id:new ObjectId(branch_id)}) //.skip(skip).limit(limit)

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
        // console.log(req.body);
        upload(req, res, async function (err) {
            
            
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err);
              } else if (err) {
                // An unknown error occurred when uploading.
                console.log(err);
              } 
              else
              {
                // console.log(req.body);
                
            const{client_id, client_name, client_dob, client_mobile_number, client_emailId, client_gender, client_pancard, client_addharcard,client_aadhaar_number,client_postaladdress,sip_refered_by_clientId,sip_reference_level,client_landmark,client_country,client_state,client_city,client_status,branch_id} = req.body; 

            var client_record = await clientModel.find({_id:new ObjectId(req.params.client_id)});

            let clientOtherdocs = client_record[0].client_otherdocs
            let clientAddharCard = client_record[0].client_addharcard

            if(req.files.client_otherdocs != undefined)
            {
                clientOtherdocs = req.files.client_otherdocs[0].filename
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
                client_emailId: (client_emailId== 'null' || client_emailId== '')?null:client_emailId,
                client_gender: client_gender,
                client_otherdocs: clientOtherdocs,
                client_addharcard: clientAddharCard,
                client_aadhaar_number: client_aadhaar_number,
                client_postaladdress: client_postaladdress,
                client_landmark: (client_landmark== 'null' || client_landmark== '')?null:client_landmark,
                sip_refered_by_clientId:(sip_refered_by_clientId == 'null' || sip_refered_by_clientId == '')?null:sip_refered_by_clientId,
                sip_reference_level:Number(sip_reference_level),
                client_country: client_country,
                client_state: client_state,
                client_city: client_city,
                client_status:client_status,
                branch_id:branch_id
            }
            // console.log(DataToSave);
            
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

export const verifyClientUploadAction = async (req,res)=>{
    try
    {
        for(let i in req.body)
        {
            const{client_name, client_dob, client_mobile_number, client_emailId, client_gender,client_postaladdress,client_landmark,client_aadhaar_number,sip_refered_by_clientId,sip_reference_level,client_country,client_state,client_city,client_status,branch_id} = req.body[i];

            if(client_name == undefined || validator.isEmpty(client_name))
            {
                req.body[i].status= 0;
                req.body[i].msg=" Name is required."
            }
            else if(client_dob == undefined || validator.isEmpty(client_dob))
            {
                req.body[i].status= 0;
                req.body[i].msg="Date Of Birth is required."
            }
            else if(client_postaladdress == undefined || validator.isEmpty(client_postaladdress))
            {
                req.body[i].status= 0;
                req.body[i].msg="Postal Address is required."
            }
            else if(! await validateDateOfBirth(client_dob))
            {  
                req.body[i].status= 0;
                req.body[i].msg="Client must be at least 1 year old."
            }
            else if(client_mobile_number == undefined || validator.isEmpty(client_mobile_number.toString()))
            {
                req.body[i].status= 0;
                req.body[i].msg="Mobile Number is required."
            }
            else if(client_aadhaar_number == undefined || validator.isEmpty(client_aadhaar_number))
            {
                req.body[i].status= 0;
                req.body[i].msg="Aadhaar Number is required."
            }
            else if(!validator.isNumeric(client_aadhaar_number))
            {
                req.body[i].status= 0;
                req.body[i].msg="Aadhaar Number contains only digits."
            }
            else if(!validator.isLength(client_aadhaar_number,12,12))
            {
                req.body[i].status= 0;
                req.body[i].msg="Aadhaar Number contains 12 digits."
            }
            else if (client_country == undefined || validator.isEmpty(client_country))
            {
                req.body[i].status= 0;
                req.body[i].msg="Country is required."
            }
            else if (client_state == undefined || validator.isEmpty(client_state))
            {
                req.body[i].status= 0;
                req.body[i].msg="State is required."
            }
            else if (client_city == undefined || validator.isEmpty(client_city))
            {
                req.body[i].status= 0;
                req.body[i].msg="City/Village is required."
            }
            else if (branch_id == undefined || validator.isEmpty(branch_id))
            {
                req.body[i].status= 0;
                req.body[i].msg="Branch is required."
            }
            else if (! await validateBranch(branch_id))
            {
                req.body[i].status= 0;
                req.body[i].msg="Branch is invalid."
            }
            else
            {
                req.body[i].status=1;
                req.body[i].msg=""
            }
        }

        res.status(200).json({ message: 'Verification Action Called.',status:true, client:req.body });
    }
    catch(error)
    {
        res.status(400).json({ error: error.message });
    }
}

export const ImportClientUploadAction = async (req,res)=>{
    try
    {
        for(let i in req.body)
        {
            const{client_name, client_dob, client_mobile_number, client_emailId, client_gender,client_postaladdress,client_landmark,client_aadhaar_number,sip_refered_by_clientId,sip_reference_level,client_country,client_state,client_city,client_status,branch_id,status} = req.body[i];

            if(req.body[i]['status'] == 1)
            {

                var branchDetails = await branchModel.find({branch_code:branch_id});

                var clientDetails = await clientModel.find({branch_id:new ObjectId(branchDetails[0]._id)});

                var Branchcode = branchDetails[0].branch_code

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
                    NewClient_Id = Branchcode+'-'+ActualId.toString()
                }
                else
                {
                    ActualId = ActualId+1;
                    NewClient_Id = Branchcode+'-'+ActualId.toString()
                }

                var client_DataToSave = {
                    client_id: NewClient_Id,
                    client_name: client_name,
                    client_dob: formatDate(client_dob),
                    client_mobile_number: client_mobile_number,
                    client_emailId: (client_emailId== 'null' || client_emailId== '' || client_emailId==undefined)?null:client_emailId,
                    client_gender: client_gender,
                    client_otherdocs: null,
                    client_aadhaar_number: client_aadhaar_number,
                    client_addharcard: null,
                    client_postaladdress: client_postaladdress,
                    client_landmark: (client_landmark== 'null' || client_landmark== '' || client_landmark==undefined)?null:client_landmark,
                    sip_refered_by_clientId:(sip_refered_by_clientId == 'null' || sip_refered_by_clientId == '')?null:sip_refered_by_clientId,
                    sip_reference_level:Number(sip_reference_level),
                    client_country: client_country,
                    client_state: client_state,
                    client_city: client_city,
                    client_status:true,
                    branch_id:branchDetails[0]._id
                }
            
                    
            
                // console.log('=========================================================');
                // console.log(userstoadd);
                    // console.log('=========================================================');
                // console.log(client_DataToSave);
                    const client = new clientModel(client_DataToSave);
                    await client.save();
                    
                req.body[i].msg = `Record Added with Client Id ${NewClient_Id}.`
                    
            }
            else
            { 
                req.body[i].msg = "Record Not Added."  
            }
        }

        res.status(200).json({ message: 'Upload Action Called.',status:true, client:req.body });
    }
    catch(error)
    {
        res.status(400).json({ error: error.message });
    }
}

const validateDateOfBirth = (dob)=>{

    const [day, month, year] = dob.split("-");
    const date = new Date(`${year}-${month}-${day}`); // Create a Date object

    const formattedDate = date.toISOString().split("T")[0];
    const dob_date = new Date(formattedDate);
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    return dob_date <= oneYearAgo;
}

const validateBranch = async (branch_id)=>{
    
    var branchData = await branchModel.findOne({branch_code:branch_id});
    
    if(branchData == null)
    return false;
    else
    return true;
}

const formatDate = (inputdate)=>{

    const [day, month, year] = inputdate.split("-");
    const date = new Date(`${year}-${month}-${day}`); // Create a Date object

    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
}

export const DeleteSelectedClientction = async(req,res)=>{
    // console.log(req.body);

    try
    {
        for(let val of req.body)
        {
            var client = await clientModel.deleteOne({_id:new ObjectId(val)});
        }

        res.status(200).json({msg:'All Selected Client Deleted sucessfully',status:true})
    }
    catch(error)
    {
        res.status(400).json({msg:'Error While Deleting Client',status:false,error:error.message})
    }
    
}