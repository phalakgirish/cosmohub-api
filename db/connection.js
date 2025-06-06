import mongoose from 'mongoose';

async function connection(){

    
    return await mongoose.connect('mongodb://127.0.0.1:27017/cosmohub')


}

export default connection;