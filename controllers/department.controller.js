import mongoose from "mongoose";
import departmentModel from "../models/department.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const createDepartmentAction = async (req, res) => {
    const{department_name,branch_name,department_status} = req.body;   
    try {

        var DataToSave = {
            department_name: department_name,
            branch_name: branch_name,
            department_status: department_status
        }
        const department = new departmentModel(DataToSave);
        await department.save();


        res.status(201).json({ message: 'Department added successfully',status:true ,department });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getDepartmentByIdAction = async (req, res) => {
    try {

        var department = await departmentModel.aggregate([
            {$match:{_id:new ObjectId(req.params.department_id)}},
          ])
        if (department.length == 0) {
            return res.status(404).json({ message: 'Department not found',status:false });
        }
        res.status(200).json({ department });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getDepartmentAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const branch_id = req.query.branch_id || '0';
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        let department 
        if(branch_id == '0')
        {
            department = await departmentModel.find().skip(skip).limit(limit);
        }
        else
        {
            department = await departmentModel.find({branch_id:new ObjectId(branch_id)}).skip(skip).limit(limit);
        }
        if (!department) {
            return res.status(404).json({ message: 'Department not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ department });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteDepartmentAction = async (req, res) => {
    try {

        var department = await departmentModel.deleteOne({_id:new ObjectId(req.params.department_id)})
        res.status(201).json({ message: 'Department deleted successfully',status:true, department });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateDepartmentAction = async (req, res) => {
    const{department_name,branch_name,department_status} = req.body;   
    try {

        var DataToSave = {
            department_name: department_name,
            branch_name: branch_name,
            department_status: department_status
        }
        
        const department = await departmentModel.findByIdAndUpdate({_id:new ObjectId(req.params.department_id)},DataToSave);


        res.status(201).json({ message: 'Department updated successfully',status:true ,department });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// export const searchDepartment= async (req, res) => {
//     try {
//       const patient_name = req.params.department_name
//       const pageNumber = req.query.page || 1;
//       const limit = 10;
//       const skip = (pageNumber - 1) * limit;
//       const patient = await departmentModel.find({branch_name:{ $regex: patient_name, $options: 'i' }}).skip(skip).limit(limit);
//       if (!patient) {
//         return res.status(404).json({ message: 'Patient not found',status:false });
//       }
//       res.status(200).json({ patient });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };

export const getAllDepartmentAction = async (req, res) => {
    try {


        var department = await departmentModel.find({branch_name:new ObjectId(req.params.branch_id)});
        if (!department) {
            return res.status(404).json({ message: 'Department not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ department });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};