
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    userId:String,
    products : [
    {
        items : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'items'
       },
       quantity:{
            type: Number,
            default: 1
       }
    }
    ]
});



export default mongoose.model('cart' , cartSchema);