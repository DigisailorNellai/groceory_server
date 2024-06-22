import mongoose from "mongoose";

const categorySchema = new mongoose.Schema ({
    categoryName : { 
        type: String,
        required: true,
        },
    image:String,
    items : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'items'
        }
    ]
    //brand: {type: mongoose.Schema.Types.ObjectId, ref: 'brandSchema'}
});


export default mongoose.model('category' ,categorySchema);
