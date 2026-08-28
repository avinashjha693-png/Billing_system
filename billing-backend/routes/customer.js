import {Router} from 'express';
import {Customer, NextCustomerId} from '../data/store.js';

const router = Router();

router.get("/", (req, res) => {
    return res.json(Customer);
})

router.post("/", (req, res) => {
    const {name, phone} = req.body;
    if(!name){
        return res.status(400).json({error: "Invalid request body"});
    }

    const newCustomer = {
        id: NextCustomerId(),
        name: name,
        phone: phone || ""
    }

    Customer.push(newCustomer);
    res.status(201).json(newCustomer);
})

export default router;