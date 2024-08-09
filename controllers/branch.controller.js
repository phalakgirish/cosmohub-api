import mongoose from "mongoose";
import branchModel from "../models/branch.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const createBranchAction = async (req, res) => {
    const{branch_name,branch_contact_person,branch_mobile_number,branch_emailId,branch_area,branch_city,branch_district,branch_taluka,branch_pincode,branch_state,branch_status} = req.body;   
    try {

        var DataToSave = {
            branch_name: branch_name,
            branch_contact_person: branch_contact_person,
            branch_mobile_number: branch_mobile_number,
            branch_emailId: branch_emailId,
            branch_area: branch_area,
            branch_city: branch_city,
            branch_district: branch_district,
            branch_taluka: branch_taluka,
            branch_pincode: branch_pincode,
            branch_state: branch_state,
            branch_status: branch_status
        }
        const branch = new branchModel(DataToSave);
        await branch.save();


        res.status(201).json({ message: 'Branch added successfully',status:true ,branch });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getBranchByIdAction = async (req, res) => {
    try {
        // console.log('All123');
        
        // const staff = await staffModel.find(req.params.staff_id);
        var branch = await branchModel.aggregate([
            {$match:{_id:new ObjectId(req.params.branch_id)}},
          ])
        if (branch.length == 0) {
            return res.status(404).json({ message: 'Branch not found',status:false });
        }
        res.status(200).json({ branch });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getBranchAction = async (req, res) => {
    try {
        // const staff = await staffModel.find();
        // const staff1 = await Shift.find();
        // console.log('All');
        
        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var branch = await branchModel.find().skip(skip).limit(limit)
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ branch });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBranchAction = async (req, res) => {
    try {

        var branch = await branchModel.deleteOne({_id:new ObjectId(req.params.branch_id)})
        res.status(201).json({ message: 'Branch deleted successfully',status:true, branch });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateBranchAction = async (req, res) => {
    const{branch_name,branch_contact_person,branch_mobile_number,branch_emailId,branch_area,branch_city,branch_district,branch_taluka,branch_pincode,branch_state,branch_status} = req.body;   
    try {

        var DataToSave = {
            branch_name: branch_name,
            branch_contact_person: branch_contact_person,
            branch_mobile_number: branch_mobile_number,
            branch_emailId: branch_emailId,
            branch_area: branch_area,
            branch_city: branch_city,
            branch_district: branch_district,
            branch_taluka: branch_taluka,
            branch_pincode: branch_pincode,
            branch_state: branch_state,
            branch_status: branch_status
        }
        
        const branch = await branchModel.findByIdAndUpdate({_id:new ObjectId(req.params.branch_id)},DataToSave);


        res.status(201).json({ message: 'Branch updated successfully',status:true ,branch });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// export const searchBranch= async (req, res) => {
//     try {
//     //   console.log(req.params.patient_name);
//       const patient_name = req.params.branch_name
//       const pageNumber = req.query.page || 1;
//       const limit = 10;
//       const skip = (pageNumber - 1) * limit;
//       const patient = await patientModel.find({branch_name:{ $regex: patient_name, $options: 'i' }}).skip(skip).limit(limit);
//       if (!patient) {
//         return res.status(404).json({ message: 'Patient not found',status:false });
//       }
//       res.status(200).json({ patient });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };

export const getAllBranchAction = async (req, res) => {
    try {
        // const staff = await staffModel.find();
        // const staff1 = await Shift.find();
        // console.log('All');
        
        // const pageNumber = req.query.page || 1;
        // const limit = 10;
        // const skip = (pageNumber - 1) * limit;
        var branch = await branchModel.find()
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ branch });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};