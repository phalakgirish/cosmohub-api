import mongoose from "mongoose";
import luckyDrawModel from "../models/luckyDraw.model.js";


const ObjectId = mongoose.Types.ObjectId;

export const createLuckyDrawAction = async (req, res) => {
    const{luckydraw_month,spimember_id,luckydraw_rank,ispaymentdone,branch_id} = req.body;   
    try {

        var DataToSave = {
            luckydraw_month: luckydraw_month,
            spimember_id: spimember_id,
            luckydraw_rank: luckydraw_rank,
            ispaymentdone: ispaymentdone,
            branch_id:branch_id
        }
        const luckyDraw = new luckyDrawModel(DataToSave);
        await luckyDraw.save();

        res.status(201).json({ message: 'Lucky Draw member added successfully',status:true ,luckyDraw });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getLuckyDrawByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var luckyDraw = await luckyDrawModel.aggregate([
            {$match:{_id:new ObjectId(req.params.luckydraw_id)}},
          ])
        if (luckyDraw.length == 0) {
            return res.status(404).json({ message: 'Record not found',status:false });
        }
        res.status(200).json({ luckyDraw });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getLuckyDrawAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var luckyDraw = await luckyDrawModel.find().skip(skip).limit(limit)
        if (!luckyDraw) {
            return res.status(404).json({ message: 'Record not found',status:false });
        }
        // console.log(staff1);
        res.status(200).json({ luckyDraw });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteLuckyDrawAction = async (req, res) => {
    try {

        var luckyDraw = await luckyDrawModel.deleteOne({_id:new ObjectId(req.params.luckydraw_id)})
        res.status(201).json({ message: 'Record deleted successfully',status:true, luckyDraw });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateLuckyDrawAction = async (req, res) => {
    const{luckydraw_month,spimember_id,luckydraw_rank,ispaymentdone,branch_id} = req.body;  
    try {

        var DataToSave = {
            luckydraw_month: luckydraw_month,
            spimember_id: spimember_id,
            luckydraw_rank: luckydraw_rank,
            ispaymentdone: ispaymentdone,
            branch_id:branch_id
        }
        
        const luckyDraw = await luckyDrawModel.findByIdAndUpdate({_id:new ObjectId(req.params.luckydraw_id)},DataToSave);


        res.status(201).json({ message: 'Record updated successfully',status:true ,luckyDraw });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};