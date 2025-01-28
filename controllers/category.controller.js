import mongoose from "mongoose";
import categoryModel from "../models/category.model.js";


const ObjectId = mongoose.Types.ObjectId;


export const getCategoryAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var category = await categoryModel.find() //.skip(skip).limit(limit)
        if (!category) {
            return res.status(404).json({ message: 'Category not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ category:category });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};