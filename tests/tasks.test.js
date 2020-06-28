const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/model/task");
const User = require("../src/model/user");
const {defaultUser, secondUser, setUpDatabase, taskOne, taskTwo, taskThree} = require("./fixtures/db");

beforeEach(setUpDatabase);           // beforeEach calls the passed function (like a callback function) 

test("should create task for user", async ()=>{
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
        .send({description: "Learn the Noble Quran"})
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test("testing getting tasks", async()=>{
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
        .send()
        .expect(200);
    //const user = await User.findById(defaultUser._id);
    //await user.populate("tasks").execPopulate();
    //expect(user.tasks.length).toBe(2);
    expect(response.body.length).toBe(2);
});

test("testing deleting tasks", async()=>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${secondUser.tokens[0].token}`)
        .send()
        .expect(404);
    const firstTask = await Task.findById(taskOne._id);
    expect(firstTask).not.toBeNull();
});