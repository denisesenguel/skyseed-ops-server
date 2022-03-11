const router = require("express").Router();
const Project = require("../models/Project.model");
const { isValidMongooseId } = require("../middleware/isValidMongooseId");
const { isOwnerOrManager } = require("../middleware/isOwnerOrManager");

router.post("/", async (req, res, next) => {
    try {
        const createdUser = await Project.create(req.body);
        return res.status(201).json(createdUser);
    } catch (err) {
        console.log("unique error: ", err)
        next(err);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const allProjects = await Project.find().populate("managers customer pilots");
        return res.status(200).json(allProjects);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", isValidMongooseId, async (req, res, next) => {
    try { 
        const myProject = await Project.findById(req.params.id).populate("managers customer pilots");
        if (!myProject) {
            return res.status(404).json({ message: "Project does not exist. " });
        }
        return res.status(200).json(myProject);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isValidMongooseId, isOwnerOrManager, async (req, res, next) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ message: "Project does not exist" })
        } 
        return res.status(200).json(updatedProject);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isValidMongooseId, isOwnerOrManager, async (req, res, next) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Project successfully deleted."});
    } catch (err) {
        next(err);
    }
})

module.exports = router;