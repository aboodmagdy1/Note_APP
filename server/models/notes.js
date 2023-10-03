const mongoose = require("mongoose");


const noteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    title:{
        type: String,
        required: true
    },
    body:{
        type:String,
        required: true
    }


},{timestamps:true})

module.exports = mongoose.model("Note", noteSchema);