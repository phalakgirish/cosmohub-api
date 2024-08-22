import mongoose from "mongoose";
import sipSlabModel from "../models/sipSlab.model.js";


const ObjectId = mongoose.Types.ObjectId;

export const createSipSlabAction = async (req, res) => {
    const{sip_slab_from,sip_slab_to,sip_rank,sip_amount,sip_type,sip_status,branch_id} = req.body;   

    
    try {

        var DataToSave = {
            sip_slab_from: sip_slab_from,
            sip_slab_to: sip_slab_to,
            sip_rank: sip_rank,
            sip_amount: sip_amount,
            sip_type: sip_type,
            sip_status: sip_status,
            branch_id:branch_id
        }

        
        const sip_slab = new sipSlabModel(DataToSave);
        await sip_slab.save();


        res.status(201).json({ message: 'SIP Slab added successfully',status:true ,sip_slab });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipSlabByIdAction = async (req, res) => {
    try {
        // const staff = await staffModel.find(req.params.staff_id);
        var sip_slab = await sipSlabModel.aggregate([
            {$match:{_id:new ObjectId(req.params.slab_id)}},
          ])
        if (sip_slab.length == 0) {
            return res.status(404).json({ message: 'SIP Slab not found',status:false });
        }

        let sips = [
            {
                _id:sip_slab[0]._id,
                duration:[sip_slab[0].sip_slab_from,sip_slab[0].sip_slab_to],
                rank:sip_slab[0].sip_rank,
                amount:sip_slab[0].sip_amount,
                type:sip_slab[0].sip_type,
                sip_status:sip_slab[0].sip_status,
                branch_id:sip_slab[0].branch_id
            }
        ]

        
        res.status(200).json({ sips });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSipSlabAction = async (req, res) => {
    try {

        const pageNumber = req.query.page || 1;
        const limit = 10;
        const skip = (pageNumber - 1) * limit;
        var sip_slab = await sipSlabModel.find().skip(skip).limit(limit)
        if (!sip_slab) {
            return res.status(404).json({ message: 'SIP Slab not found',status:false });
        }

        let sips = []
        for(let val of sip_slab)
        {
            let slab_rec = {
                _id:val._id,
                duration:`${val.sip_slab_from}-${val.sip_slab_to}`,
                rank:val.sip_rank,
                amount:val.sip_amount,
                type:val.sip_type,
                sip_status:val.sip_status
            }

            sips.push(slab_rec)
        }
        // console.log(staff1);
        res.status(200).json({ sips });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSipSlabAction = async (req, res) => {
    try {

        var sip_slab = await sipSlabModel.deleteOne({_id:new ObjectId(req.params.slab_id)})
        res.status(201).json({ message: 'SIP Slab deleted successfully',status:true, sip_slab });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateSipSlabAction = async (req, res) => {
    const{sip_slab_from,sip_slab_to,sip_rank,sip_amount,sip_type,sip_status,branch_id} = req.body;     
    try {

        var DataToSave = {
            sip_slab_from: sip_slab_from,
            sip_slab_to: sip_slab_to,
            sip_rank: sip_rank,
            sip_amount: sip_amount,
            sip_type: sip_type,
            sip_status: sip_status,
            branch_id:branch_id
        }
        
        
        const sip_slab = await sipSlabModel.findByIdAndUpdate({_id:new ObjectId(req.params.slab_id)},DataToSave);


        res.status(201).json({ message: 'SIP Slab updated successfully',status:true ,sip_slab });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};