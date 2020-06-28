require("./db/mongoose");
const express = require("express");       
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

// setting up a middleware function to be excuted before all the routers
// app.use( (req, res, next) => {
//     res.status(503).send({message: "Website is under maintenance"});     
//     return;
// });

app.use(express.json());  // make sure it's the first thing after const app = express();
app.use(userRouter);
app.use(taskRouter);

module.exports = app;