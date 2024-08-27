import staffModel from '../models/staff.model.js';
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import generator from 'generate-password'; 
import multer from 'multer';
import userModel from '../models/user.model.js';
import SendEmail from '../env/SendEmail.js';

var salt = bcryptjs.genSaltSync(10);

const ObjectId = mongoose.Types.ObjectId;

const SECRET = 'asded785685asd';
const TIMESTAMP = 60*60*24;

var password = generator.generate({ 
    length: 8, 
    numbers: true, 
    symbols: true, 
    uppercase: false, 
    excludeSimilarCharacters: true, 
    strict: true,     
}); 

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
    { name: 'staff_pancard', maxCount: 1 }, // Single file for 'profilePic' field
    { name: 'staff_addharcard', maxCount: 1 }   // Multiple files for 'documents' field
  ]);

//   const upload = multer({ storage: storage }).single('staff_pancard');

export const createStaffAction = async (req, res) => {

       
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
                const{staff_name,staff_dob,staff_mobile_number,staff_emailId,staff_gender,staff_pancard,staff_addharcard,staff_role_type,staff_department,staff_designation,staff_branch,staff_doj} = req.body;

                
                var staffDetails = await staffModel.find();

                let ActualId = 0
                let NewStaff_Id = ''
                if(staffDetails.length > 0)
                {
                    for(let val of staffDetails)
                    {
                        const splitNumbers = val.staff_id.split('-').map((num) => parseFloat(num.trim()));
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
                    NewStaff_Id = 'CH-'+ActualId.toString()
                }
                else
                {
                    ActualId = ActualId+1;
                    NewStaff_Id = 'CH-'+ActualId.toString()
                }
                
                var staff_DataToSave = {
                    staff_id: NewStaff_Id,
                    staff_name: staff_name,
                    staff_dob: new Date(staff_dob),
                    staff_mobile_number: staff_mobile_number,
                    staff_emailId: staff_emailId,
                    staff_gender: staff_gender,
                    staff_pancard: req.files.staff_pancard[0].filename,
                    staff_addharcard: req.files.staff_addharcard[0].filename,
                    staff_department: staff_department,
                    staff_designation: staff_designation,
                    staff_branch: staff_branch,
                    staff_doj: new Date(staff_doj),
                    staff_role_type: staff_role_type
                }
                // console.log(staff_DataToSave);
                

                const staff = new staffModel(staff_DataToSave);
                await staff.save();

                var password_encrypt = bcryptjs.hashSync(password, salt);

                var user_DataToSave = {
                    user_emailId: staff_emailId,
                    user_password: password_encrypt,
                    user_role_type: staff_role_type,
                    staff_id: staff._id,
                    user_branch: staff_branch,
                    user_status: true
                }

                const uses_data = new userModel(user_DataToSave);
                await uses_data.save();

                var usesCreatedData = {staff_email_id:staff_emailId,password:password}
                SendEmail(usesCreatedData.staff_email_id,usesCreatedData.password)
                res.status(201).json({ message: 'Staff added successfully',status:true ,usesCreatedData:usesCreatedData});
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getStaffByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var staff = await staffModel.aggregate([
            {$match:{_id:new ObjectId(req.params.staff_id)}},
          ])
        if (staff.length == 0) {
            return res.status(404).json({ message: 'Staff not found',status:false });
        }
        res.status(200).json({ staff });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getStaffsAction = async (req, res) => {
    try {
        // const staff = await staffModel.find();
        // const staff1 = await Shift.find();
        const pageNumber = req.query.page || 1;
        // const branch_id = req.query.branch_id || null;
        // console.log(branch_id);
        // branch_id = null
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var staff = await staffModel.aggregate([
            // {$match:{$or:[{branch_id:new ObjectId(branch_id)},{}]}},
            {
                $lookup: {
                  from: "departments",
                  localField: "staff_department",
                  foreignField: "_id",
                  as: "staff_department",
                },
            },
            {
                $lookup: {
                  from: "designations",
                  localField: "staff_designation",
                  foreignField: "_id",
                  as: "staff_designation",
                },
            },
            {
                $lookup: {
                  from: "branches",
                  localField: "staff_branch",
                  foreignField: "_id",
                  as: "staff_branch",
                },
            },
            {
                $project:{
                  _id:1,
                  staff_id:1,
                  staff_name: 1,
                  staff_dob: 1,
                  staff_mobile_number: 1,
                  staff_emailId: 1,
                  staff_gender:1,
                  staff_department:{ $arrayElemAt: ["$staff_department.department_name", 0] },
                  staff_designation:{ $arrayElemAt: ["$staff_designation.designation_name", 0] },
                  staff_branch:{ $arrayElemAt: ["$staff_branch.branch_name", 0] },
                  staff_doj:1
                //   AppointmentHistory:{
                //   _id:1,
                //   appointment_date_time:1,
                //   status_id:1,
                //   staff:{
                //     staff_name:1
                //     }
                //   }
                }
              }
        ])
        
        .skip(skip).limit(limit)


        if (!staff) {
            return res.status(404).json({ message: 'Staff not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ staff });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const DeleteStaffAction = async (req, res) => {
    try {
        // const staff = await staffModel.find();
        // const staff1 = await Shift.find();
        var users = await userModel.deleteOne({staff_id:new ObjectId(req.params.staff_id)})


        var staff = await staffModel.deleteOne({_id:new ObjectId(req.params.staff_id)})
        res.status(201).json({ message: 'Staff deleted successfully',status:true, staff,users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const UpdateStaffAction = async (req, res) => {
    const{staff_name,staff_mobile_number,staff_emailId,staff_type,staff_working_schedule} = req.body;   
    try {

        // console.log(req.body);
        // var personalDetails = req.body.personalDetails
        // var password_encrypt = bcryptjs.hashSync(staff_password, salt);

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err);
              } else if (err) {
                // An unknown error occurred when uploading.
                console.log(err);
              } 
              else{
                const{staff_id,staff_name,staff_dob,staff_mobile_number,staff_emailId,staff_gender,staff_pancard,staff_addharcard,staff_role_type,staff_department,staff_designation,staff_branch,staff_doj} = req.body;

                const staff_record = await staffModel.find({_id:req.params.staff_id});
                
                let staffPancard = staff_record[0].staff_pancard
                let staffAddharCard = staff_record[0].staff_addharcard

                if(req.files.staff_pancard != undefined)
                {
                    staffPancard = req.files.staff_pancard[0].filename
                }

                if(req.files.staff_addharcard != undefined)
                {
                    staffAddharCard = req.files.staff_addharcard[0].filename
                }
                
                var staff_DataToSave = {
                    staff_id: staff_id,
                    staff_name: staff_name,
                    staff_dob: new Date(staff_dob),
                    staff_mobile_number: staff_mobile_number,
                    staff_emailId: staff_emailId,
                    staff_gender: staff_gender,
                    staff_pancard: staffPancard,
                    staff_addharcard: staffAddharCard,
                    staff_department: staff_department,
                    staff_designation: staff_designation,
                    staff_branch: staff_branch,
                    staff_doj: new Date(staff_doj),
                    staff_role_type: staff_role_type
                }
                


                const staff = await staffModel.findByIdAndUpdate({_id:new ObjectId(req.params.staff_id)},staff_DataToSave);
                // await staff.save();
                res.status(201).json({ message: 'Staff Updated successfully',status:true, staff });
            }
        });

        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
