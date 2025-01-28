import express from 'express';
const categoryRouter = express.Router();
import Auth from '../env/auth.js';
import { getCategoryAction } from '../controllers/category.controller.js';

categoryRouter.get('/',Auth,getCategoryAction);

export default categoryRouter;