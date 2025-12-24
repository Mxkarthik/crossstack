import mongoose from "mongoose"; 

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "MERNAuthentication",
        });

        console.log("Connected to MongoDB");
    } 
    catch (error) {
        console.log(error);
        console.log("Failed to connect");
    }
};

export default connectDb;