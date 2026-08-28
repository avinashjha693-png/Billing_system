import {Router} from 'express';
import {Products, NextProductId} from '../data/store.js';


const router = Router();

router.get("/", (req, res) => {
     return res.json(Products);
})

router.post("/", (req, res) => {
    const {name, price} = req.body;
    if(!name || !price || typeof price !== 'number' || price < 0){
        return res.status(400).json({error: "Invalid request body"});
    }

    const newProduct = {
        id: NextProductId(),
        name: name,
        price: price
    };
    Products.push(newProduct);
    return res.status(201).json(newProduct);
})

export default router;