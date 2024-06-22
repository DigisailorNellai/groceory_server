import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: [
        {
            items:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'items'
            },
            quantity: {
                type:Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount:{type: Number, required: true},
    paymentMethod: {
        type: String, 
        enum: ['card' , 'cod', 'mobilePay'],
        required: true
    },
    paymentStatus:{
        type: String,
        enum: ['pending', 'completed', 'failed'],
        required: true
    },
    orderDate:{type:Date, default: Date.now()}
});

export default mongoose.model('order', orderSchema);