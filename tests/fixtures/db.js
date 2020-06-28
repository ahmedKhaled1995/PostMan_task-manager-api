const User = require("../../src/model/user");
const Task = require("../../src/model/task");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const defaultUserId = new mongoose.Types.ObjectId();
const defaultUserToken = jwt.sign({_id: defaultUserId}, process.env.JWT_SECRET);

const defaultUser = {
    _id: defaultUserId,
    name: "foo",
    email: "foo@example.com",
    password: "fooBarBaz",
    tokens:[{
        token: defaultUserToken
    }]
};

const secondUserId = new mongoose.Types.ObjectId();
const secondUserToken = jwt.sign({_id: secondUserId}, process.env.JWT_SECRET);

const secondUser = {
    _id: secondUserId,
    name: "baz",
    email: "baz@example.com",
    password: "fooBarBaz",
    tokens:[{
        token: secondUserToken
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "first task",
    owner: defaultUserId
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "second task",
    owner: defaultUserId
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "third task",
    owner: secondUserId
};

const setUpDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(defaultUser).save();
    await new User(secondUser).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    defaultUser,
    secondUser,
    setUpDatabase,
    taskOne,
    taskTwo,
    taskThree
};