import mongoose from "mongoose";
import express from 'express';
import categorySchema from "../models/category.js";
import itemSchema from "../models/item.js";
import brandSchema from "../models/brand.js";
import cartSchema from "../models/cart.js";

const router = express.Router();

router.get('/categories', async(req,res) => {
    try{

        const categories = await categorySchema.find().populate('items');
        res.send(categories);

    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.get('/categories/:id', async(req,res) => {
    try{
        
        //const {id} = req.params.id;
        const categories = await categorySchema.findById(req.params.id).populate('items');
        res.send(categories);

    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.get('/brands', async(req,res) => {
    try{

        const brands = await brandSchema.find();
        res.send(brands);

    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.get('/items' , async(req,res) => {

    try{

        const items = await itemSchema.find().populate('category').populate('brand');
        res.send(items);

    }catch(err){
        res.status(500).json({error: err.message});
    }
});


export default router;