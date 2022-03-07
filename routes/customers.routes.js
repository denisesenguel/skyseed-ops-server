const router = require("express").Router();
const Customer = require("../models/Customer.model");
const { isValidMongooseId } = require("../middleware/isValidMongooseId");

// may receive an object or an array of objects as request body.
router.post("/", async (req, res, next) => {
    try {
        const newCustomer = await Customer.create(req.body);
        return res.status(201).json(newCustomer);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already taken."})
        } else {
            next(err);
        }
    }
});

router.get("/", async (req, res, next) => {
    try {
        const allCustomers = await Customer.find();
        return res.status(200).json(allCustomers);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", isValidMongooseId, async (req, res, next) => {
    try {
        const myCustomer = await Customer.findById(req.params.id);
        if (!myCustomer) {
            return res.status(404).json({ message: "Customer does not exist" })
        } 
        return res.status(200).json(myCustomer);
    } catch (err) {
        next(err);
    }
});

module.exports = router;