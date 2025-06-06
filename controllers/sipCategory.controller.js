import mongoose from "mongoose";
import sipCategoryModel from "../models/sipCategory.model.js";

const ObjectId = mongoose.Types.ObjectId;


export const createSipCategoryAction = async (req, res) => {
    const{sipcategory_name,is_commission_calculate,sipcategory_status} = req.body;  

    try {

        var DataToSave = {
            sipcategory_name: sipcategory_name,
            is_commission_calculate: is_commission_calculate,
            sipcategory_status: sipcategory_status,
        }

        const sip_category = new sipCategoryModel(DataToSave);
        await sip_category.save();

        res.status(201).json({ message: 'SIP category added successfully',status:true ,sip_category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipCategoryByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var sip_category = await sipCategoryModel.findOne({_id:new ObjectId(req.params.sipcategory_id)});
        if (!sip_category) {
            return res.status(404).json({ message: 'Reference Level not found',status:false });
        }

        res.status(200).json({ sip_category:sip_category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipCategoryAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var sip_category = await sipCategoryModel.find() //.skip(skip).limit(limit)
        if (!sip_category) {
            return res.status(404).json({ message: 'SIP Category not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ sip_category:sip_category });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSipCategoryAction = async (req, res) => {
    try {

        var sip_category = await sipCategoryModel.deleteOne({_id:new ObjectId(req.params.sipcategory_id)})
        res.status(201).json({ message: 'SIP Category deleted successfully',status:true, sip_category });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateSipCategoryAction = async (req, res) => {
    const{sipcategory_name,is_commission_calculate,sipcategory_status} = req.body;  
   
    try {

        var DataToSave = {
            sipcategory_name: sipcategory_name,
            is_commission_calculate: is_commission_calculate,
            sipcategory_status: sipcategory_status,
        }
        
        
        const sip_category = await sipCategoryModel.findByIdAndUpdate({_id:new ObjectId(req.params.sipcategory_id)},DataToSave);


        res.status(201).json({ message: 'Reference Level updated successfully',status:true ,sip_category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};