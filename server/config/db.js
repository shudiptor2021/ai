import mongoose from "mongoose";

const connectDB = async () => {
    try{
       mongoose.connection.on('connected', ()=> console.log('Connected to MongoDB'));
       await mongoose.connect(process.env.DATABASE_URL)
    }catch(error){
        console.log(error.message)
    }
}


export default connectDB;