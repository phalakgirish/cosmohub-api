import mongoose from "mongoose";
import branchModel from "../models/branch.model.js";
import departmentModel from "../models/department.model.js";
import designationModel from "../models/designation.model.js";
import clientModel from "../models/client.model.js";
import userModel from "../models/user.model.js";
import sipMemberMgmtModel from "../models/sipManagerment.model.js";
import staffModel from "../models/staff.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const getDepartmentByBranchIdAction = async (req, res) => {
    try {
        console.log(req.params);
        
        // const staff = await staffModel.find(req.params.staff_id);
        var department = await departmentModel.aggregate([
            {$match:{$and:[{branch_name:new ObjectId(req.params.branch_id)},{department_status:true}]}},
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
            {$match:{$and:[{department_name:new ObjectId(req.params.department_id)},{designation_status:true}]}},
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

export const getSipMemberByBranchIdAction = async (req, res) => {
    try {

        
        // const staff = await staffModel.find(req.params.staff_id);
        const branch_id = req.params.branch_id;
        let sipmember

          if(branch_id == '0')
            {
                sipmember = await sipMemberMgmtModel.aggregate([
                    {$match:{sipmember_status:'Continue'}},
                    {$project:{
                        _id:1,
                        sipmember_id:1,
                        sipmember_name:1
                    }}
                  ])
            }
            else
            {
                sipmember = await sipMemberMgmtModel.aggregate([
                    {$match:{$and:[{branch_id:new ObjectId(req.params.branch_id)},{sipmember_status:'Continue'}]}},
                    {$project:{
                        _id:1,
                        sipmember_id:1,
                        sipmember_name:1
                    }}
                  ])
            }
            if (!sipmember) {
                return res.status(404).json({ message: 'SIP Member not found',status:false });
            }
            // console.log(client1);
            res.status(200).json({ sipmember });
        // if (department.length == 0) {
        //     return res.status(404).json({ message: 'Department not found',status:false,department });
        // }
        // res.status(200).json({ designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getStaffByBranchIdAction = async (req, res) => {
    try {

        
        // const staff = await staffModel.find(req.params.staff_id);
        const branch_id = req.params.branch_id;
        let staff

          if(branch_id == '0')
            {
                staff = await staffModel.aggregate([
                    {$project:{
                        _id:1,
                        stastaff_id:1,
                        staff_name:1
                    }}
                  ])
            }
            else
            {
                staff = await staffModel.aggregate([
                    {$match:{staff_branch:new ObjectId(req.params.branch_id)}},
                    {$project:{
                        _id:1,
                        staff_id:1,
                        staff_name:1
                    }}
                  ])
            }
            if (!staff) {
                return res.status(404).json({ message: 'staff not found',status:false });
            }
            // console.log(client1);
            res.status(200).json({ staff });
        // if (department.length == 0) {
        //     return res.status(404).json({ message: 'Department not found',status:false,department });
        // }
        // res.status(200).json({ designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getSipMemberByClientIdAction = async (req, res) => {
    try {

        
        // const staff = await staffModel.find(req.params.staff_id);
        const client_id = req.params.client_id;
        let sipmember

                sipmember = await sipMemberMgmtModel.aggregate([
                    {$match:{$and:[{client_id:new ObjectId(client_id)},{sipmember_status:'Continue'}]}},
                    {$project:{
                        _id:1,
                        sipmember_id:1,
                        sipmember_name:1
                    }}
                  ])

            if (!sipmember) {
                return res.status(404).json({ message: 'SIP Member not found',status:false });
            }
            // console.log(client1);
            res.status(200).json({ sipmember });
        // if (department.length == 0) {
        //     return res.status(404).json({ message: 'Department not found',status:false,department });
        // }
        // res.status(200).json({ designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};