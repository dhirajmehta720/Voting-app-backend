import mongoose from "mongoose";

const connectdb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected");
    } catch (error) {
        console.log("MongoDb not connected");
    }
}
export {connectdb};