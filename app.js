import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from "mongoose";
import staffRouter from "./routes/staff.route.js";
import connection from './db/connection.js';
import loginRouter from "./routes/login.route.js";
import branchRouter from "./routes/branch.route.js";
import departmentRouter from "./routes/department.route.js";
import designationRouter from "./routes/designation.route.js";
import sipSlabRouter from "./routes/sipSlab.route.js";
import clientRouter from "./routes/client.route.js";
import sipMaturityRouter from "./routes/sipMaturity.route.js";
import sipPaymentRouter from "./routes/sipPayment.route.js";
import luckyDrawRouter from "./routes/luckyDraw.route.js";
import sipManagementRouter from "./routes/sipManagement.route.js";
import allRouter from "./routes/all.route.js";
import { fileURLToPath } from 'url'
// const path = require('path');
import path from 'node:path';
import userRouter from "./routes/user.route.js";
import reportRouter from "./routes/report.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import cron from 'node-cron';
import { getSIPMemberIdShedulerAction } from "./controllers/sipPayment.controller.js";



connection() 
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//http://13.233.99.253:3000/login


app.use('/staff',staffRouter)
app.use('/branch',branchRouter);
app.use('/login',loginRouter)
app.use('/department',departmentRouter);
app.use('/designation',designationRouter);
app.use('/sipslab',sipSlabRouter)
app.use('/client',clientRouter)
app.use('/sipmaturity',sipMaturityRouter)
app.use('/sippayment',sipPaymentRouter)
app.use('/luckydraw',luckyDrawRouter)
app.use('/sipmanagement',sipManagementRouter)
app.use('/all',allRouter)
app.use('/users',userRouter)
app.use('/report',reportRouter)
app.use('/dashboard',dashboardRouter)

cron.schedule('59 23 14 * *',getSIPMemberIdShedulerAction,{scheduled:true,timezone:"Asia/Kolkata"})





const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

app.use('/images',express.static(path.join(_dirname,'/assets/uploads')))



// app.use('/dashboard',dashboardRouter)



const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});