import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    brandName:{
        type: String,
        required : true
    }
});

export default mongoose.model('brand', brandSchema);