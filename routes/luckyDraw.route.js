import express from 'express';
const luckyDrawRouter = express.Router();
import Auth from '../env/auth.js';
import { createLuckyDrawAction, deleteLuckyDrawAction, getLuckyDrawAction, getLuckyDrawByIdAction, updateLuckyDrawAction } from '../controllers/luckydraw.controller.js';


luckyDrawRouter.post('/',Auth,createLuckyDrawAction);
luckyDrawRouter.get('/:luckydraw_id',Auth,getLuckyDrawByIdAction);
luckyDrawRouter.get('/',Auth,getLuckyDrawAction);
luckyDrawRouter.put('/:luckydraw_id',Auth,updateLuckyDrawAction);
luckyDrawRouter.delete('/:luckydraw_id',Auth,deleteLuckyDrawAction);
// luckyDrawRouter.get('/:designation_id',Auth,deleteBranchAction); //search


export default luckyDrawRouter;