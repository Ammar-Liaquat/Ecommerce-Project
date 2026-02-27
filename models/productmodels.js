const mongoose = require("mongoose")

const clothsSchema = mongoose.Schema({

    userId : {
    type:mongoose.Schema.Types.ObjectId,ref:"user",},
    name:String,
    price:Number,
    avatar:String,
    stock:Number,
    category:{
        type:String,
        enum:["cloth","shoes"]
}

},{ timestamps: true })
module.exports = mongoose.model("cloths",clothsSchema)