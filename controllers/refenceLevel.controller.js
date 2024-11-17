import mongoose from "mongoose";
import referenceLevelModel from "../models/referenceLevel.model.js";


const ObjectId = mongoose.Types.ObjectId;

export const createReferenceLevelAction = async (req, res) => {
    const{reference_level,reference_bouns,reference_effective,reference_status} = req.body;  
    // console.log(req.body);
     

    
    try {

        var DataToSave = {
            reference_level: reference_level,
            reference_bouns: reference_bouns,
            reference_effective: reference_effective,
            reference_status: reference_status,
            // branch_id:branch_id
        }

        
        const reference_levels = new referenceLevelModel(DataToSave);
        await reference_levels.save();


        res.status(201).json({ message: 'Reference Level added successfully',status:true ,reference_levels });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceLevelByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var reference_levels = await referenceLevelModel.findOne({_id:new ObjectId(req.params.reference_id)});
        if (!reference_levels) {
            return res.status(404).json({ message: 'Reference Level not found',status:false });
        }

        res.status(200).json({ reference_levels:reference_levels });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceLevelAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var reference_levels = await referenceLevelModel.find() //.skip(skip).limit(limit)
        if (!reference_levels) {
            return res.status(404).json({ message: 'Reference Levels not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ reference_levels:reference_levels });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteReferenceLevelAction = async (req, res) => {
    try {

        var reference_levels = await referenceLevelModel.deleteOne({_id:new ObjectId(req.params.reference_id)})
        res.status(201).json({ message: 'Reference Level deleted successfully',status:true, reference_levels });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateReferenceLevelAction = async (req, res) => {
    const{reference_level,reference_bouns,reference_effective,reference_status} = req.body;    
    try {

        var DataToSave = {
            reference_level: reference_level,
            reference_bouns: reference_bouns,
            reference_effective: reference_effective,
            reference_status: reference_status,
            // branch_id:branch_id
        }
        
        
        const reference_levels = await referenceLevelModel.findByIdAndUpdate({_id:new ObjectId(req.params.reference_id)},DataToSave);


        res.status(201).json({ message: 'Reference Level updated successfully',status:true ,reference_levels });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};