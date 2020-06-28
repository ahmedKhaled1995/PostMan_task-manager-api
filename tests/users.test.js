const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/user");
const {defaultUser, setUpDatabase} = require("./fixtures/db");

beforeEach(setUpDatabase);           // beforeEach calls the passed function (like a callback function) 

test("testing user login", async () => {
    await request(app).post("/users").send({
        name: "ahmedTest",
        email: "bigbossak84@gmail.com",
        password: "assassinahmed208"
    }).expect(201);
});

test("testing user login", async()=>{
    const response = await request(app)
        .post("/users/login") 
        .send({
        email: defaultUser.email,
        password: defaultUser.password
    }).expect(200);
    const user = await User.findById(defaultUser._id);
    expect(user.tokens[1].token).toBe(response.body.token);
});

test("should not login non existent user", async()=>{
    await request(app)
        .post("/users/login")
        .send({
        email: defaultUser.email,
        password: "asdaasdasdasd"
    }).expect(400);
});

test("should get user profile", async ()=>{
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
        .send()
        .expect(200);
}); 

test("should not get user profile", async ()=>{
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
}); 

test("should delete account for user", async ()=>{
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
        .send()
        .expect(200);
        const user = await User.findById(defaultUser._id);
        expect(user).toBeNull();
}); 

test("should not delete account for user", async ()=>{
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});

test("user uplading avatar", async ()=>{
    const response = await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/me.jpg")            // notice how the second argument sets the directory of the image you want to send relatice to the root folder 
        .expect(200);
    const user = await User.findById(defaultUser._id);
    expect(user.avatar).toEqual(expect.any(Buffer));          // checking the type of the sent image to be buffer(binary)
});

test("should accept valid user fields", async ()=>{
    const newUser = {
        name:"bar",
        email: "bar@example.com",
        password: "foobarbaz",
    };
    await request(app)
        .post("/users")
        .send(newUser)
        .expect(201);
});

test("should not accept invalid user fields", async ()=>{
    const newUser = {
        name:"foo",
        email: "foo@example.com",
        password: "foobarbaz",
        location: "India"
    };
    await request(app)
        .post("/users")
        .send(newUser)
        .expect(400);
});