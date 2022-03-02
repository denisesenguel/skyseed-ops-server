const router = require("express").Router();
const Project = require("../models/Project.model");
const mongoose = require("mongoose");

router.post("/", async (req, res, next) => {
    try {
        const createdUser = await Project.create(req.body);
        return res.status(201).json(createdUser);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: "Title already taken."})
        }
        next(err);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const allProjects = await Project.find().populate("managers");
        return res.status(200).json(allProjects);
    } catch (err) {
        next(err);
    }
});

router.get("/:projectId", async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
            return res.status(400).json({
                message: 'Invalid project ID specified'
            });
        }
        const { projectId } = req.params;
        const myProject = await Project.findById(projectId).populate("managers");
        res.status(200).json(myProject);
    } catch (err) {
        next(err);
    }
});

router.put("/:projectId", async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
            return res.status(400).json({
                message: 'Invalid project ID specified'
            });
        }
        const { projectId } = req.params;
        const updatedProject = await Project.findByIdAndUpdate(projectId, req.body, { new: true });
        return res.status(200).json(updatedProject);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: "Title already taken."})
        }
        next(err);
    }
});

router.delete("/:projectId", async (req, res, next) => {
    try {
        // define this as middleware
        if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
            return res.status(400).json({
                message: 'Invalid project ID specified'
            });
        }
        const { projectId } = req.params;
        await Project.findByIdAndDelete(projectId);
        return res.status(200).json({ message: "Project successfully deleted."});
    } catch (err) {
        next(err);
    }
})

module.exports = router;