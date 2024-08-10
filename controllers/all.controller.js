import mongoose from "mongoose";
import branchModel from "../models/branch.model.js";
import departmentModel from "../models/department.model.js";
import designationModel from "../models/designation.model.js";

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