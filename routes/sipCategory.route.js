import express from 'express';
const sipCategoryRouter = express.Router();
import Auth from '../env/auth.js';
import { createSipCategoryAction, deleteSipCategoryAction, getSipCategoryAction, getSipCategoryByIdAction, updateSipCategoryAction } from '../controllers/sipCategory.controller.js';


sipCategoryRouter.post('/',Auth,createSipCategoryAction);
sipCategoryRouter.get('/:sipcategory_id',Auth,getSipCategoryByIdAction);
sipCategoryRouter.get('/',Auth,getSipCategoryAction);
sipCategoryRouter.put('/:sipcategory_id',Auth,updateSipCategoryAction);
sipCategoryRouter.delete('/:sipcategory_id',Auth,deleteSipCategoryAction);


export default sipCategoryRouter;