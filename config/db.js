const mongoose = require("mongoose")

const connectdb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb is connected");
        
    } catch (error) {
        console.log("mongodb is not connected",error);
        
    }
}

module.exports = connectdb