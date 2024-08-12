import mongoose from "mongoose";
import branchModel from "../models/branch.model.js";
import departmentModel from "../models/department.model.js";
import designationModel from "../models/designation.model.js";
import clientModel from "../models/client.model.js";
import userModel from "../models/user.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const getDepartmentByBranchIdAction = async (req, res) => {
    try {
        console.log(req.params);
        
        // const staff = await staffModel.find(req.params.staff_id);
        var department = await departmentModel.aggregate([
            {$match:{branch_name:new ObjectId(req.params.branch_id)}},
            {$project:{
                _id:1,
                department_name:1
            }}
          ])
        // if (department.length == 0) {
        //     return res.status(404).json({ message: 'Department not found',status:false,department });
        // }
        res.status(200).json({ department });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getDesignationByDepartmentIdAction = async (req, res) => {
    try {

        
        // const staff = await staffModel.find(req.params.staff_id);
        var designation = await designationModel.aggregate([
            {$match:{department_name:new ObjectId(req.params.department_id)}},
            {$project:{
                _id:1,
                designation_name:1
            }}
          ])
        // if (department.length == 0) {
        //     return res.status(404).json({ message: 'Department not found',status:false,department });
        // }
        res.status(200).json({ designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClientsByBranchIdAction = async (req, res) => {
    try {

        
        // const staff = await staffModel.find(req.params.staff_id);
        const branch_id = req.params.branch_id;
        let client

          if(branch_id == '0')
            {
                client = await clientModel.aggregate([
                    {$project:{
                        _id:1,
                        client_id:1,
                        client_name:1
                    }}
                  ])
            }
            else
            {
                client = await clientModel.aggregate([
                    {$match:{branch_id:new ObjectId(req.params.branch_id)}},
                    {$project:{
                        _id:1,
                        client_id:1,
                        client_name:1
                    }}
                  ])
            }
            if (!client) {
                return res.status(404).json({ message: 'Client not found',status:false });
            }
            // console.log(client1);
            res.status(200).json({ client });
        // if (department.length == 0) {
        //     return res.status(404).json({ message: 'Department not found',status:false,department });
        // }
        // res.status(200).json({ designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const getUsersByBranchIdAction = async (req, res) => {
    try {

        
        // const staff = await staffModel.find(req.params.staff_id);
        const branch_id = req.params.branch_id;
        let users

        if(branch_id == '0')
            {
                users = await userModel.aggregate([
                    {
                        $project:{
                            _id:1,
                            user_emailId:1,
                            user_role_type:1,
                            user_branch:1,
                            user_status:1
                        }
                    }
                  ])
            }
            else
            {
                users = await userModel.aggregate([
                    {$match:{user_branch:new ObjectId(req.params.branch_id)}},
                    {
                        $project:{
                            _id:1,
                            user_emailId:1,
                            user_role_type:1,
                            user_branch:1,
                            user_status:1
                        }
                    }
                  ])
            }
        
        if (!users) {
            return res.status(404).json({ message: 'Users not found',status:false });
        }
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};