import mongoose from 'mongoose';

async function connection(){

    
    // return await mongoose.connect('mongodb://127.0.0.1:27017/cosmohub')

// return await mongoose.connect('mongodb+srv://admin:appointment123@native-app.1ajnrxb.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    return await mongoose.connect('mongodb+srv://pravinkarande2483:@cluster0.namu5dc.mongodb.net/cosmohub')

    //KzTWwM0bHm5n85Cc
    
   

}

export default connection;