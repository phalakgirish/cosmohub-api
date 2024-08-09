import mongoose from "mongoose";
import designationModel from "../models/designation.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const createDesignationAction = async (req, res) => {
    const{designation_name,designation_desc,department_name,designation_status} = req.body;   
    try {

        var DataToSave = {
            designation_name: designation_name,
            department_name: department_name,
            designation_status: designation_status
        }
        const designation = new designationModel(DataToSave);
        await designation.save();


        res.status(201).json({ message: 'Designation added successfully',status:true ,designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getDesignationByIdAction = async (req, res) => {
    try {

        var designation = await designationModel.aggregate([
            {$match:{_id:new ObjectId(req.params.designation_id)}},
          ])
        if (designation.length == 0) {
            return res.status(404).json({ message: 'Designation not found',status:false });
        }
        res.status(200).json({ designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getDesignationAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const branch_id = req.query.branch_id || '0';
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        let designation
        if(branch_id == '0')
        {
            designation = await designationModel.find().skip(skip).limit(limit)
        }
        else
        {
            designation = await designationModel.find({branch_id:new ObjectId(branch_id)}).skip(skip).limit(limit)
        }
        if (!designation) {
            return res.status(404).json({ message: 'Designation not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ designation });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteDesignationAction = async (req, res) => {
    try {

        var designation = await designationModel.deleteOne({_id:new ObjectId(req.params.designation_id)})
        res.status(201).json({ message: 'Designation deleted successfully',status:true, designation });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateDesignationAction = async (req, res) => {
    const{designation_name,designation_desc,department_name,designation_status} = req.body;     
    try {

        var DataToSave = {
            designation_name: designation_name,
            department_name: department_name,
            designation_status: designation_status
        }
        
        const designation = await designationModel.findByIdAndUpdate({_id:new ObjectId(req.params.designation_id)},DataToSave);


        res.status(201).json({ message: 'Designation updated successfully',status:true ,designation });
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

export const getAllDesignationAction = async (req, res) => {
    try {

        var designation = await designationModel.find({department_name:new ObjectId(req.params.department_id)});
        if (!designation) {
            return res.status(404).json({ message: 'Designation not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ designation });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};