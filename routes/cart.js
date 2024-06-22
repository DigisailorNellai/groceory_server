import express from 'express';
import cartSchema from "../models/cart.js";

const router = express.Router();

router.post ('/cart/add', async (req,res) => {
    try{

        const {userId , itemId, quantity} = req.body;
        
        let cart = await cartSchema.findOne({userId});
        if(!cart){
            cart =  new cartSchema({userId , products: []});
        }
        
        
        const itemsIndex = cart.products.findIndex(p => p.items.toString() === itemId);

        if (itemsIndex > -1) {
             cart.products[itemsIndex].quantity += quantity;
        } else {
            // If product does not exist, add new product to cart
            cart.products.push({ items: itemId, quantity });
        }
        //cart.products.push(itemId);
        await cart.save();
        res.status(200).json({message:'product added to the cart', cart});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.get('/cart/:userId' , async (req,res) => {
    try{

        const {userId} = req.params;
        const userCart = await cartSchema.findOne({userId}).populate('products.items');
        if (!userCart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const formatedProducts = userCart.products.map(p => {
            return {
                item: p.items,
                quantity: `${p.quantity} ${p.items.unit}`,
                price: p.items.price,
                totalPrice: p.quantity * p.items.price
            };
        });
        const totalAmount = formatedProducts.reduce((sum, p) => sum + p.totalPrice, 0);
        res.status(200).json({ userId: userCart.userId, products: formatedProducts, totalAmount });

    }catch(err) {
        res.status(500).json({error:err.message});
    }
});

// router.post ('/cart/add', async (req,res) => {
//     try{

//         const {userId , itemId, quantity} = req.body;
        
//         let cart = await cartSchema.findOne({userId});
//         if(!cart){
//             cart =  new cartSchema({userId , products: []});
//         }
        
        
//         const itemsIndex = cart.products.findIndex(p => p.items.toString() === itemId);

//         if (itemsIndex > -1) {
//              cart.products[itemsIndex].quantity += quantity;
//         } else {
//             // If product does not exist, add new product to cart
//             cart.products.push({ items: itemId, quantity });
//         }
//         //cart.products.push(itemId);
//         await cart.save();
//         res.status(200).json({message:'product added to the cart', cart});
//     }catch(err){
//         res.status(500).json({error:err.message});
//     }
// });

router.put('/updateCart/:itemId', async (req, res) => {

    try {
        const {itemId} = req.params;
        const { userId, quantity } = req.body;
        let cart = await cartSchema.findOne({ userId });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });

        const itemIndex = cart.products.findIndex(p => p.items.toString() === itemId);
        if(itemIndex > -1){
            cart.products[itemIndex].quantity = quantity;
            await cart.save();
            const updatedCart = await cartSchema.findOne({userId}).populate('products.items');
            const formattedProducts = updatedCart.products.map(p => {
                    return {
                        product: p.items,
                        quantity: `${p.quantity} ${p.items.unit}`,
                        price: p.items.price,
                        totalPrice: p.quantity * p.items.price
                    };
            });
            const totalAmount = formattedProducts.reduce((sum, p) => sum + p.totalPrice,0);
            res.status(200).json({userId: updatedCart.userId, products: formattedProducts, totalAmount});
        }else {
            res.status(404).json({error:'Items not found in cart'});
        }


       
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/cart/delete/:itemId', async(req,res) => {

    try{
        const { userId } = req.body;
        const {itemId} = req.params;
        let cart = await cartSchema.findOne({userId});
        if(!cart) {
            return res.status(400).json({error:'cart not found'})
        }
        cart.products = cart.products.filter(p => p.items && p.items.toString() !== itemId);
        await cart.save();
        const updatedCart = await cartSchema.findOne({ userId }).populate('products.items');
        const formatedProducts = updatedCart.products.map(p => {
            return{
                product: p.items,
                quantity: `${p.quantity} ${p.items.unit}`,
                price: p.items.price,
                totalPrice: p.quantity * p.items.price
            };
        });
        const totalAmount = formatedProducts.reduce((sum,p) => sum + p.totalPrice, 0);
        res.status(200).json({ message: "Product removed from cart successfully" , userCart:updatedCart.userId, products: formatedProducts, totalAmount });
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

export default router;