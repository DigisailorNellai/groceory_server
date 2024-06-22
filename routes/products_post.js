import express from 'express';
import multer from 'multer';
import categorySchema from "../models/category.js";
import itemSchema from "../models/item.js";
import brandSchema from "../models/brand.js";
import cartSchema from "../models/cart.js";


const router = express.Router();
const uploads = multer({ dest : 'uploads/'});


router.post('/category' , uploads.single('image'), async (req,res) => {
    try{
        
        const category = new categorySchema(req.body);
        await category.save();
        res.send(category);

    }catch(err){
        res.status(500).json({message:err.message});
    }
});


router.post('/brand' ,  async (req,res) => {
    try{
        
        const brand = new brandSchema(req.body);
        await brand.save();
        res.send(brand);

    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.post('/items', uploads.single('image'),async(req,res) => {
    try{
        const {title, description, price, stock, categoryId, brandId, unit} = req.body;
        if (!stock || (stock.kg === undefined && stock.number === undefined && stock.lt === undefined)) {
            return res.status(400).json({ msg: 'Stock in kg or number are required' });
        }
        //console.log('Category ID:', categoryId);
        const itemCategories = await categorySchema.findById(categoryId);
        const itemBrand = await brandSchema.findById(brandId);
       // console.log('Found Category:', itemCategories);
        if(!itemCategories){
            return res.status(400).json({error:'category not found'});
        }
        if(!itemBrand){
            return res.status(400).json({error:'brand not found'});
        }
        const items = new itemSchema({
            image: req.file.path,
            title,
            description,
            price,
            stock,
            category : categoryId,
            brand : brandId,
            unit
        });
        await items.save();
        itemCategories.items.push(items._id);
        await itemCategories.save();
        res.send(items);
    }catch(err){
        res.status(500).json({message:err.message});
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

// router.put('/updateCart/:itemId', async (req, res) => {

//     try {
//         const {itemId} = req.params;
//         const { userId, quantity } = req.body;
//         let cart = await cartSchema.findOne({ userId });
//         if (!cart) return res.status(404).json({ msg: 'Cart not found' });

//         const itemIndex = cart.products.findIndex(p => p.items.toString() === itemId);
//         if(itemIndex > -1){
//             cart.products[itemIndex].quantity = quantity;
//             await cart.save();
//             const updatedCart = await cartSchema.findOne({userId}).populate('products.items');
//             const formattedProducts = updatedCart.products.map(p => {
//                     return {
//                         product: p.items,
//                         quantity: `${p.quantity} ${p.items.unit}`,
//                         price: p.items.price,
//                         totalPrice: p.quantity * p.items.price
//                     };
//             });
//             const totalAmount = formattedProducts.reduce((sum, p) => sum + p.totalPrice,0);
//             res.status(200).json({userId: updatedCart.userId, products: formattedProducts, totalAmount});
//         }else {
//             res.status(404).json({error:'Items not found in cart'});
//         }


       
        
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// router.delete('/cart/delete/:itemId', async(req,res) => {

//     try{
//         const { userId } = req.body;
//         const {itemId} = req.params;
//         let cart = await cartSchema.findOne({userId});
//         if(!cart) {
//             return res.status(400).json({error:'cart not found'})
//         }
//         cart.products = cart.products.filter(p => p.items && p.items.toString() !== itemId);
//         await cart.save();
//         const updatedCart = await cartSchema.findOne({ userId }).populate('products.items');
//         const formatedProducts = updatedCart.products.map(p => {
//             return{
//                 product: p.items,
//                 quantity: `${p.quantity} ${p.items.unit}`,
//                 price: p.items.price,
//                 totalPrice: p.quantity * p.items.price
//             };
//         });
//         const totalAmount = formatedProducts.reduce((sum,p) => sum + p.totalPrice, 0);
//         res.status(200).json({ message: "Product removed from cart successfully" , userCart:updatedCart.userId, products: formatedProducts, totalAmount });
//     }catch(err){
//         res.status(500).json({error:err.message});
//     }
// });

router.put('/stock/:id' ,  async(req,res) => {
    try{
        const {kg,number,lt} = req.body;
        const {id} = req.params;
        const itemStock = await itemSchema.findById(id);
        if(!itemStock) {
            return res.status(400).json({error:'item not found'});
        }
        if(kg !== undefined){
            itemStock.stock.kg = kg;
        }
        if(number !== undefined){
            itemStock.stock.number = number;
        }
        if(lt !== undefined){
            itemStock.stock.lt = lt;
        }
        await itemStock.save();
        res.status(200).json({message: 'updated stock' , itemStock});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.put('/purchase/:id' , async(req,res) => {
    try{
        const {kg,number,lt} = req.body;
        const {id} = req.params;
        const itemStock = await itemSchema.findById(id);
        if(!itemStock) {
            return res.status(400).json({error:'item not found'});
        }
        if(kg !== undefined){
            if(itemStock.stock.kg < kg){
                return res.status(400).json({error:'insufficient stock'});
            }
            itemStock.stock.kg -= kg;
        }
        if(number !== undefined){
            if(itemStock.stock.number < number){
                return res.status(400).json({error:'insufficient stock'});
            }
            itemStock.stock.number -= number;
        }
        if(lt !== undefined){
            if(itemStock.stock.lt < lt){
                return res.status(400).json({error:'insufficient stock'});
            }
            itemStock.stock.lt -= lt;
        }
        await itemStock.save();
        res.status(200).json({message: 'updated stock' , itemStock});

    }catch(err){
        res.status(500).json({error:'err.message'});
    }
});

export default router;