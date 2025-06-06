import mongoose from "mongoose";
import multer from 'multer';
import clientModel from "../models/client.model.js";
import branchModel from "../models/branch.model.js";
import validator from "validator";
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import referenceSchemePaymentModel from "../models/referenceSchemePay.model.js";
import referenceSchemeModel from "../models/referenceScheme.model.js";
import sipReferenceModel from "../models/sipReference.model.js";

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
                // console.log(req.body);
                // var personalDetails = req.body.personalDetails
                const{client_name, client_dob, client_mobile_number, client_emailId, client_gender, client_otherdocs, client_addharcard,client_aadhaar_number,client_postaladdress,client_landmark,sip_refered_by_clientId,sip_reference_level,client_country,client_state,client_city,client_status,client_bank_name, client_bank_account_no, client_bank_ifsc,client_others,client_sip_refrence_family,branch_id} = req.body;

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
                    client_others:client_others,
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
                    client_bank_name:client_bank_name,
                    client_bank_account_no:client_bank_account_no,
                    client_bank_ifsc:client_bank_ifsc,
                    client_sip_refrence_family:client_sip_refrence_family,
                    branch_id:branch_id
                }

                // console.log(client_DataToSave);
                

                const client = new clientModel(client_DataToSave);
                await client.save();


                if(sip_refered_by_clientId !== 'null' && sip_refered_by_clientId)
                {
                    var sipreference = await createSIPReferenceAction(client._id)
                }

                
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
        //   console.log(client);
          
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
        let client1 

        
        if(branch_id == '0')
        {
            client = await clientModel.find() //.skip(skip).limit(limit)
            client1 = await clientModel.find()
            .populate('sip_refered_by_clientId','client_id client_name')
            .populate('branch_id','branch_name') //.skip(skip).limit(limit)

        }
        else
        {
            client = await clientModel.find({branch_id:new ObjectId(branch_id)}) //.skip(skip).limit(limit)
            client1 = await clientModel.find({branch_id:new ObjectId(branch_id)})
            .populate('sip_refered_by_clientId','client_id client_name')
            .populate('branch_id','branch_name') //.skip(skip).limit(limit)


        }
        if (!client) {
            return res.status(404).json({ message: 'Client not found',status:false });
        }
        // console.log(client1);
        res.status(200).json({ client,client1 });
        
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
                
            const{client_id, client_name, client_dob, client_mobile_number, client_emailId, client_gender, client_pancard, client_addharcard,client_aadhaar_number,client_postaladdress,sip_refered_by_clientId,sip_reference_level,client_landmark,client_country,client_state,client_city,client_status,client_bank_name, client_bank_account_no, client_bank_ifsc,client_others,client_sip_refrence_family,branch_id} = req.body; 

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
                client_others:client_others,
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
                client_bank_name:client_bank_name,
                client_bank_account_no:client_bank_account_no,
                client_bank_ifsc:client_bank_ifsc,
                client_status:client_status,
                client_sip_refrence_family:client_sip_refrence_family,
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
    // console.log(req.body);
    
    try
    {
        for(let i in req.body)
        {
            // console.log(req.body[i]);
            
            const{client_name, client_dob, client_mobile_number, client_emailId, client_gender,client_postaladdress,client_landmark,client_aadhaar_number,sip_refered_by_clientId,sip_reference_level,client_country,client_state,client_city,client_status,client_sip_refrence_family,branch_id} = req.body[i];

            if(client_name == undefined || validator.isEmpty(client_name))
            {
                req.body[i].status= 0;
                req.body[i].msg=" Name is required."
            }
            if(await VerifiedDuplicateClient(client_name))
            {
                
                var clientDetails = await clientModel.aggregate([{$match:{client_name:{ $regex: client_name,$options:'i' }}}]);

                req.body[i].status= 0;
                req.body[i].msg=`Client will already exist on ${clientDetails[0].client_id} id with same name.`
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
            else if (branch_id == undefined || validator.isEmpty(branch_id.toString()))
            {
                req.body[i].status= 0;
                req.body[i].msg="Branch is required."
            }
            else if (! await validateBranch(branch_id.toString()))
            {
                req.body[i].status= 0;
                req.body[i].msg="Branch is invalid."
            }
            else if(sip_refered_by_clientId != 'null' && ! await VerifiedReferedClient(sip_refered_by_clientId.toString()))
            {
                req.body[i].status= 0;
                req.body[i].msg="Referred Client Id is invalid."
            }
            else if(client_sip_refrence_family  == undefined || validator.isEmpty(client_sip_refrence_family.toString()))
                {
                    req.body[i].status= 0;
                    req.body[i].msg="Is Referred By Family is required."
                }
            else
            {
                req.body[i].status=1;
                req.body[i].msg=""
            }
        }
        // console.log("Cycle Completed");
        
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
            const{client_name, client_dob, client_mobile_number, client_emailId, client_gender,client_postaladdress,client_landmark,client_aadhaar_number,sip_refered_by_clientId,sip_reference_level,client_country,client_state,client_city,client_status,client_sip_refrence_family,branch_id,status} = req.body[i];

            if(req.body[i]['status'] == 1)
            {

                var branchDetails = await branchModel.find({branch_code:branch_id});

                var clientDetails = await clientModel.find({branch_id:new ObjectId(branchDetails[0]._id)});
                var referedClientId
                if(sip_refered_by_clientId != 'null' || sip_refered_by_clientId == '')
                {
                    referedClientId = await clientModel.findOne({client_id:sip_refered_by_clientId})
                }

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
                    sip_refered_by_clientId:(sip_refered_by_clientId == 'null' || sip_refered_by_clientId == '')?null:referedClientId._id,
                    sip_reference_level:Number(sip_reference_level),
                    client_country: client_country,
                    client_state: client_state,
                    client_city: client_city,
                    client_status:true,
                    client_sip_refrence_family:client_sip_refrence_family,
                    branch_id:branchDetails[0]._id
                }
            
                    
            
                // console.log('=========================================================');
                // console.log(userstoadd);
                    // console.log('=========================================================');
                // console.log(client_DataToSave);
                    const client = new clientModel(client_DataToSave);
                    await client.save();

                    if(sip_refered_by_clientId != 'null' || sip_refered_by_clientId == '')
                    {
                        var sipreference = await createSIPReferenceAction(client._id)
                    }
                

                    
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

const VerifiedReferedClient = async(clientId)=>{

    var clientDetails = await clientModel.findOne({client_id:clientId});

    if(clientDetails == null)
        return false;
    else
        return true;
}

const VerifiedDuplicateClient = async(clientName)=>{
    // console.log(clientName);
    
    var clientDetails = await clientModel.aggregate([{$match:{client_name:{ $regex: clientName, $options: 'i' }}}]);
    console.log(clientDetails);
    
    if(clientDetails.length == 0)
        return false;
    else
        return true;
}


export const VerifiedAddDuplicateClient = async(req,res)=>{
    
    var clientName = req.query.clientName;
    
    var clientDetails = await clientModel.aggregate([{$match:{client_name:{ $regex: clientName, $options: 'i' }}}]);
    
    if(clientDetails.length == 0)
        res.status(200).json({msg:"",status:true})
    else
        res.status(200).json({msg:`Client will already exist on ${clientDetails[0].client_id} id with same name.`,status:false});
}

export const updateCreatedDate = async(req,res)=>{

    var ClientDate = await clientModel.find();

    var clientDts = [];

    for(let val of ClientDate)
    {
        var spimemeberDetails = await sipMemberMgmtModel.findOne({client_id:new ObjectId(val._id)}).sort({_id:1})
        console.log(spimemeberDetails);
        
        if(spimemeberDetails != null)
        {
            var updateClient = await clientModel.updateOne({_id:new ObjectId(val._id)},{$set:{createdAt:new Date(spimemeberDetails.sipmember_doj)}})

            clientDts.push(val)
        }
        
    }

    res.status(200).json({clientDts});
}
var clientCount = 0;
const createSIPReferenceAction = async (clientId)=>{

    var todayDate = new Date()

    var newclientDetails = await clientModel.findOne({_id:new ObjectId(clientId)}).sort({_id:1})
    
    // console.log(newclientDetails);
    
    
    // var sipmember_client_id = sip_refered_by_clientId
    var sip_refered_by_clientId = newclientDetails.sip_refered_by_clientId
    clientCount = clientCount+1
    // console.log(clientCount,sip_refered_by_clientId);
    // console.log(newclientDetails.sip_refered_by_clientId,clientId);
    
    if((sip_refered_by_clientId !== 'null' && sip_refered_by_clientId && sip_refered_by_clientId.toString() != clientId.toString()))
    // if((newclientDetails.sip_refered_by_clientId != null) && newclientDetails.sip_refered_by_clientId.toString() != clientId.toString())
    {
        
        // console.log(clientCount,typeof (newclientDetails.sip_refered_by_clientId),newclientDetails.client_id,clientId);
        var Client_Ref_sch_pay_Dts = await referenceSchemePaymentModel.findOne({$and:[{client_id:new ObjectId(sip_refered_by_clientId)},{reference_category:"SIP"}]}).sort({_id: -1})
        // ,{ref_payment_expirationDate:{$gte:todayDate}}

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

            var client_reference_details = await sipReferenceModel.findOne({$and:[{sipmember_clientid:new ObjectId(clientId)},{sip_refered_by:new ObjectId(sip_refered_by_clientId)},{comission_type:comissionType}]}).sort({_id:-1});
            // 

            var newdate = new Date();
            // newdate.setMinutes(newdate.getMinutes()+330);
            var todaydate = newdate.getFullYear()+'-'+((newdate.getMonth() + 1)<=9?'0'+(newdate.getMonth() + 1):newdate.getMonth() + 1)+'-'+(newdate.getDate());
            var from_date = new Date(todaydate);
            from_date.setHours(5,30,0,0);
                            
            var ReferedClient_id = []
            var UpdatedClientId = [] 

            var sip_refered_by_clientId_temp = sip_refered_by_clientId;
            var DataToSaveSIPReference;
            
            if(!client_reference_details)
            {
                // console.log('651', branch_id);
                
                var referedClientCount = await sipReferenceModel.find({sip_refered_by:new ObjectId(sip_refered_by_clientId)})

                // if(referedClientCount.length >= 5 && comissionType == 'Recurring')
                // {
                //     var GetReferedClientDetails = await clientModel.findOne({_id:new ObjectId(sip_refered_by_clientId)})

                //     // (sip_refered_by_clientId !== 'null' && sip_refered_by_clientId && sip_refered_by_clientId.toString() != clientId.toString())

                //     if( GetReferedClientDetails.sip_refered_by_clientId !== 'null' && GetReferedClientDetails.sip_refered_by_clientId && GetReferedClientDetails.sip_refered_by_clientId.toString() != sip_refered_by_clientId)  
                //     {
                //         var AllReferedClient =  await sipReferenceModel.find({sip_refered_by:new ObjectId(GetReferedClientDetails.sip_refered_by_clientId)}).sort({_id:1});

                //         if(AllReferedClient.length > 0)
                //         {
                //             var AllReferedClientId = [];

                //             for(let id of AllReferedClient)
                //             {
                //                 if(id.sipmember_clientid != sip_refered_by_clientId)
                //                 {
                //                     AllReferedClientId.push(id.sipmember_clientid)
                //                 }  
                //             }

                //             var countId = await sipReferenceModel.aggregate([
                //                 {$match:{sip_refered_by:{$in:AllReferedClientId}}},
                //                 {
                //                     $group:{
                //                         _id:{
                //                                 sip_refered_by:"$sip_refered_by"
                //                             },
                //                             totalCount:{$sum: 1}
                //                     }
                //                 }
                //                 ])

                //                 var referenceId = countId.filter((item)=> item.totalCount < 5)

                //                 if(referenceId.length > 0)
                //                 {
                //                     var tempcount = 0
                //                     var tempreferenceId
                //                     var tempReferDate = null

                //                     for(let val of referenceId)
                //                     {     
                //                         if(val.totalCount > tempcount)
                //                         {
                //                             tempcount = val.totalCount
                //                             tempreferenceId = val._id.sip_refered_by
                //                             var referencDetils = await sipReferenceModel.findOne({sipmember_clientid:new ObjectId(val._id.sip_refered_by)})
                
                //                             tempReferDate = referencDetils.sip_referedDate
                //                         }
                //                         else if(val.totalCount == tempcount)
                //                         {
                //                             var referencDetils = await sipReferenceModel.findOne({sipmember_clientid:new ObjectId(val._id.sip_refered_by)})
                
                //                             if(tempReferDate != null)
                //                             {
                //                                 if(referencDetils.sip_referedDate > tempReferDate)
                //                                 {
                //                                     tempcount = val.totalCount
                //                                     tempreferenceId = val._id.sip_refered_by
                //                                     tempReferDate = referencDetils.sip_referedDate
                //                                 }
                //                             }
                //                             else
                //                             {
                //                                 tempcount = val.totalCount
                //                                 tempreferenceId = val._id.sip_refered_by
                //                                 tempReferDate = referencDetils.sip_referedDate
                //                             }   
                //                         }
                //                     }

                //                     sip_refered_by_clientId_temp = tempreferenceId
                //                 }
                //             }
                //     }
                // }

                    DataToSaveSIPReference = {
                        sipmember_clientid: clientId,
                        sip_refered_by: sip_refered_by_clientId_temp,
                        sip_referedDate: newclientDetails.createdAt,
                        comission_type: comissionType,
                        branch_id: newclientDetails.branch_id
                    }
                    // console.log(clientId);
                    
                    // if(clientId == '6790e0aa51213cb9fe488956')
                    // {
                    //     console.log('473')
                        // console.log('752',DataToSaveSIPReference);
                    //     // console.log(clientId);
                    // }
                    
                    

                    var ClientLevel = await clientModel.findOne({_id: new ObjectId(sip_refered_by_clientId_temp)})

                    ReferedClient_id.push({referedbyclientId:sip_refered_by_clientId_temp,comissionType:comissionType,level:0})

                    // var updateClientDetails = await clientModel.updateOne({_id:new ObjectId(clientId)},{$set:{sip_refered_by_clientId:sip_refered_by_clientId_temp}})

                    // if(clientId == '6790e0aa51213cb9fe488956')
                    // {
                    //     console.log('473')
                    //     console.log('751',DataToSaveSIPReference);
                    //     // console.log(clientId);
                    // }
                    const sip_reference = new sipReferenceModel(DataToSaveSIPReference);
                    await sip_reference.save(); 
                    
                    
            }

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
                            if(ReferedByClient_Id.sip_reference_level < 6)
                            {
                                var client_update_reference_level = await clientModel.updateOne(
                                { _id: new ObjectId(val.referedbyclientId) },
                                    {
                                        $set: {
                                            sip_reference_level: ReferedByClient_Id.sip_reference_level+1,
                                        },
                                    }
                                )   
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


            return DataToSaveSIPReference;
        }
    }
}

export const clientDataCorrect = async (req,res)=>{
    
    // var clientDetails = await referenceSchemePaymentModel.find();
    try{

        var ClientErrorDetails = [];
        var clientDetails = await clientModel.find();
        for(let val of clientDetails)
        {
            var sipreferenceData = await createSIPReferenceAction(val._id)
            // console.log(val);
            // const expirationDate = new Date(val.ref_payment_receivedDate);
            // expirationDate.setDate(expirationDate.getDate() + 365);
            // console.log(expirationDate);
                
            // var reference_payment = await referenceSchemePaymentModel.updateOne({_id:new ObjectId(val._id)},{$set:{ref_payment_expirationDate:expirationDate}})
                
            ClientErrorDetails.push(sipreferenceData)
            
        }

        res.status(201).json({msg:"Data corrected successfully", status:true,ClientErrorDetails})
    }
    catch(error)
    {
        // ClientErrorDetails.push({ error: error.message,val })
    }
    
}