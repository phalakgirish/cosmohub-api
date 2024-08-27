import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import generator from 'generate-password'; 
import changePasswordSendEmail from "../env/ChangePasswordSendEmail.js";

var salt = bcryptjs.genSaltSync(10);

const ObjectId = mongoose.Types.ObjectId;

const SECRET = 'asded785685asd';

var password = generator.generate({ 
    length: 8, 
    numbers: true, 
    symbols: true, 
    uppercase: false, 
    excludeSimilarCharacters: true, 
    strict: true,     
}); 

export const createAllUsersByBranchIdAction = async (req,res)=>{


    var branch_id = req.params.branch_id;
    let users
    if(branch_id == '0')
    {
        users  = await userModel.aggregate([
            {
                $lookup:{
                    from: "staffs",
                    localField: "staff_id",
                    foreignField: "_id",
                    as: "Staff",
                }
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "user_branch",
                    foreignField: "_id",
                    as: "users_branch",
                },
            },
            {
                $project:{
                    _id:1,
                    user_emailId: 1,
                    user_role_type: 1,
                    staff_name: { $arrayElemAt: ["$Staff.staff_name", 0] },
                    user_branch: { $arrayElemAt: ["$users_branch.branch_name", 0] },
                    user_status: 1
                }
            }
        ])
    }
    else
    {
        users  = await userModel.aggregate([
            {$match:{user_branch:new ObjectId(branch_id)}},
            {
                $lookup:{
                    from: "staffs",
                    localField: "staff_id",
                    foreignField: "_id",
                    as: "Staff",
                }
            },
            {
                $project:{
                    _id:1,
                    user_role_type: 1,
                    staff_name: { $arrayElemAt: ["$Staff.staff_name", 0] },
                    user_branch: 1,
                    user_status: 1
                }
            }
        ])
    }

    if (users.length == 0) {
        return res.status(404).json({ message: 'Users not found',status:false });
    }

    res.status(200).json({ users });
}

export const updateUsersAction = async (req,res)=>{

    const {user_status} = req.body;

    var users_id = req.params.user_id;
    var users = await userModel.updateOne({_id:new ObjectId(users_id)},{$set:{user_status:user_status}})

    if (users.length == 0) {
        return res.status(404).json({ message: 'Users not found',status:false });
    }

    res.status(200).json({ message:'User Updated Sucessfully',status:true });
}

export const updateUsersChangePasswordAction = async (req,res)=>{


    var users_id = req.params.user_id;
    var ans_username = await userModel.findOne({_id:new ObjectId(users_id)});

    var password_encrypt = bcryptjs.hashSync(password, salt);

    var users = await userModel.updateOne({_id:new ObjectId(users_id)},{$set:{user_password:password_encrypt}})

    if (users.length == 0) {
        return res.status(404).json({ message: 'Users not found',status:false });
    }
    
    var usesCreatedData = {staff_email_id:ans_username.user_emailId,password:password}
    changePasswordSendEmail(usesCreatedData.staff_email_id,usesCreatedData.password)
    res.status(200).json({ message:'User Password Changed Sucessfully',status:true, usesCreatedData:usesCreatedData});
}

export const updateUsersPasswordAction = async (req,res)=>{

    try{
        
        const{user_oldpassword, user_newpassword, user_confirmpassword} = req.body;
        var users_id = req.params.user_id;
        var ans_username = await userModel.findOne({_id:new ObjectId(users_id)});

        var ans_pass = bcryptjs.compareSync(user_oldpassword,ans_username['user_password']);

        if(ans_pass)
        {
            var password_encrypt = bcryptjs.hashSync(user_confirmpassword, salt);

            var users = await userModel.updateOne({_id:new ObjectId(users_id)},{$set:{user_password:password_encrypt}})

            if (users.length == 0) {
                return res.status(404).json({ message: 'Users not found',status:false });
            }
            
            res.status(200).json({ message:'User Password Changed Sucessfully',status:true });
        }
        else
        {
            res.status(400).json({message:'Old password is not match to existing password',status:false})
        }
    }
    catch(error)
    {
        res.status(401).json({error:error,status:false})
    }
    

    
}