import mongoose from "mongoose";




const itemSchema = new mongoose.Schema({
    image: String,
    title: { type: String, required: true},
    description : { type:String },
    price: {type: Number, required: true},
    stock: {
         //required: true,
         kg:{
            type: Number,
            default: 0
            
         },
         number: {
            type:Number,
            default: 0
            
         },
         lt: {
            type:Number,
            default: 0
         }
         },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    brand : { type: mongoose.Schema.Types.ObjectId, ref: 'brand'},
    unit: {
        type: String,
        enum :['kg','number', 'lt'],
        required : true 
    }
});

export default mongoose.model('items' , itemSchema);