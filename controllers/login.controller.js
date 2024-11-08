import jwt from 'jsonwebtoken';
import validator from 'validator'; 
import bcryptjs from 'bcryptjs';
import mongoose from "mongoose";
import userModel from '../models/user.model.js';
import staffModel from '../models/staff.model.js';

const ObjectId = mongoose.Types.ObjectId;

const SECRET = 'asded785685asd';
const TIMESTAMP = 60*60*24;

export const loginActionFunction = async function(req,res){
    // console.log(req.body);

    try
    {
        var {user_emailid,user_password} = req.body;
        // console.log(req.body);
        
        var ans_username = await userModel.findOne({user_emailId:user_emailid});
        // console.log(ans_username);

        if(ans_username === null)
        {
            res.send({msg:"User Email Id Not Found.",status:false});
        }
        else if(ans_username.user_status === false)
        {
            res.send({msg:"User Email Id Is Inactive, Please Contact Admin !!",status:false});
        }
        else
        {
            var ans_pass = bcryptjs.compareSync(user_password,ans_username['user_password']);

            if(ans_pass)
            {
                var branch_id = await staffModel.findOne({_id:new ObjectId(ans_username['staff_id'])});
                // console.log(branch_id);
                

                var payload = {
                    _id:ans_username['_id'],
                    user_emailId:ans_username['user_emailId'],
                    user_role_type:ans_username['user_role_type'],
                    staff_id:(branch_id == null)?"0":branch_id['_id'],
                    staff_branch:(branch_id == null)?"0":branch_id['staff_branch'],
                    staff_name:(branch_id == null)?"Admin":branch_id['staff_name'],
                    user_status:ans_username['user_status'],
                };
                // console.log(payload);

                var tokenvalue = jwt.sign({
                    data: payload,
                },SECRET,{expiresIn:60*60*24});

                // console.log(tokenvalue);
                res.send({msg:"Proceed To Dashboard",status:true,token:tokenvalue});
            }
            else
            {
                res.send({msg:"Invalid User Email Id and Password",status:false})
            }
        }

    }
    catch(error)
    {
        console.log(error);
    }
}