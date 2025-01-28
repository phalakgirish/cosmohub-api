import mongoose from "mongoose";
import referenceSchemeModel from "../models/referenceScheme.model.js";


const ObjectId = mongoose.Types.ObjectId;


export const createRefenrenceSchemeAction = async (req, res) => {
    const{refScheme_name,refScheme_category,refScheme_amount,refScheme_comission,refScheme_status} = req.body;  

    try {

        var DataToSave = {
            refScheme_name: refScheme_name,
            refScheme_category: refScheme_category,
            refScheme_amount:refScheme_amount,
            refScheme_comission:refScheme_comission,
            refScheme_status:refScheme_status
        }

        const reference_scheme = new referenceSchemeModel(DataToSave);
        await reference_scheme.save();

        res.status(201).json({ message: 'Reference Scheme added successfully',status:true ,reference_scheme });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceSchemeByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var reference_scheme = await referenceSchemeModel.findOne({_id:new ObjectId(req.params.refScheme_id)});
        if (!reference_scheme) {
            return res.status(404).json({ message: 'Reference Scheme not found',status:false });
        }

        res.status(200).json({ reference_scheme:reference_scheme });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceSchemeAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var reference_scheme = await referenceSchemeModel.find() //.skip(skip).limit(limit)
        if (!reference_scheme) {
            return res.status(404).json({ message: 'Reference Scheme not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ reference_scheme:reference_scheme });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteReferenceSchemeAction = async (req, res) => {
    try {

        var reference_scheme = await referenceSchemeModel.deleteOne({_id:new ObjectId(req.params.refScheme_id)})
        res.status(201).json({ message: 'Reference Scheme deleted successfully',status:true, reference_scheme });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateReferenceSchemeAction = async (req, res) => {
    const{refScheme_name,refScheme_category,refScheme_amount,refScheme_comission,refScheme_status} = req.body; 
   
    try {

        var DataToSave = {
            refScheme_name: refScheme_name,
            refScheme_category: refScheme_category,
            refScheme_amount:refScheme_amount,
            refScheme_comission:refScheme_comission,
            refScheme_status:refScheme_status
        }
        
        
        const reference_scheme = await referenceSchemeModel.findByIdAndUpdate({_id:new ObjectId(req.params.refScheme_id)},DataToSave);


        res.status(201).json({ message: 'Reference Scheme updated successfully',status:true ,reference_scheme });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReferenceSchemeByCategory = async(req,res)=>{
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        // console.log(req.params.category);
        
        var reference_scheme = await referenceSchemeModel.find({refScheme_category:req.params.category});
        if (!reference_scheme) {
            return res.status(404).json({ message: 'Reference Scheme not found',status:false });
        }

        res.status(200).json({ reference_scheme:reference_scheme });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}