import express from 'express' ;
import orderSchema from '../models/order.js';
import order from '../models/order.js';

const router = express.Router();

router.post('/order/place', async (req,res) => {

    try{
        const {userId, paymentMethod} = req.body;
        const userCart = await cartSchema.fineOne({userId}).populate('produts.items');
        if(!userCart){
            return res.status(400).json({error:'cart not found'});
        }
        totalAmount = userCart.products.reduce((sum,p) => sum + p.quantity * p.quantity.price, 0);

        const userOrder = new orderSchema({
            userId,
           product: userCart.products.map(p =>({
                items: p.items,
                quantity: p.quantity,
                price: p.price,
            }) 
            ),
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
            
        });

        await order.save();

    }catch(err){
        res.status(500).json({error:err.message});
    }
});