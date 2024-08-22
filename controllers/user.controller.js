import mongoose from "mongoose";
import userModel from "../models/user.model.js";

const ObjectId = mongoose.Types.ObjectId;

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