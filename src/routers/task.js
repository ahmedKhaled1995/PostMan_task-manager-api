const express = require("express");
const Task = require("../model/task");             // description, |completed|
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.authorizedUser._id
    });
    await task.populate("owner").execPopulate();
    try{
        await task.save();
        res.status(201).send(task);
    }catch(error){
        res.status(400).send(error);
    }
});

//GET /tasks?completed=true
//&limit=2
//&skip=1
//&sortBy=createdAt:asc || desc
router.get("/tasks", auth, async (req, res)=>{
    try{
        const completedQuery = req.query.completed;
        const match = {};
        if(completedQuery){
            match.completed = (completedQuery === "true");
        }
        const sortBy = req.query.sortBy;
        const sort = {};
        if(sortBy){
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = (parts[1] === "desc" ? -1 : 1); 
        }
        // await req.authorizedUser.populate("tasks").execPopulate();
        await req.authorizedUser.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.authorizedUser.tasks);
    }catch{
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res)=>{
    const _id = req.params.id;
    const task = await Task.findOne({_id, owner: req.authorizedUser._id});
    try{
        if(!task){
            res.status(404).send();
            return;
        }
        res.status(200).send(task);
    }catch{
        res.status(500).send();
    }
});

router.patch("/tasks/:id", auth, async(req, res)=>{
    const userUpdatesList = Object.keys(req.body);
    const allowedUpdatesList = ["description", "completed"];
    const validUpdate = userUpdatesList.every((update)=>{
        return allowedUpdatesList.includes(update);
    });
    if(!validUpdate){
        res.status(400).send({error: "Invalid update parameters!"});
        return;
    }
    try{
        //const taskDocToUpdate = await Task.findById(req.params.id);
        const taskDocToUpdate = await Task.findOne({_id: req.params.id, owner: req.authorizedUser._id});
        if(!taskDocToUpdate){
            res.status(404).send();
            return;
        }
        userUpdatesList.forEach((update) => {
            taskDocToUpdate[update] = req.body[update];
        });
        await taskDocToUpdate.save();
        //const taskDocToUpdate = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.send(taskDocToUpdate);
    }catch(error){
        res.status(400).send(error);
    }
    
});

router.delete("/tasks/:id", auth, async (req, res)=>{
    const _id = req.params.id;
    try{
        //const deletedTask = await Task.findByIdAndDelete(_id);
        const deletedTask = await Task.findOneAndDelete({_id, owner: req.authorizedUser._id});
        if(!deletedTask){
            res.status(404).send({error: "Task not found!"});
            return;
        }
        res.send(deletedTask);
    }catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;