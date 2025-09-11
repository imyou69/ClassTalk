import mongoose from "mongoose";

const connectDB = async ()=>{
    mongoose.connection.on('connected',()=> console.log("Db connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/auth`);
}

export default connectDB;