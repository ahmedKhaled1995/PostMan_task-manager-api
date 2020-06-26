const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({  
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age is invalid!")
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(validator.contains(value, "password")){
                throw new Error('Password can\'t contain \'password\'!');
            }
        }
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// think of it as setting one to many relationship between User model and Task model:
// (one) User can have (Many) Tasks
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",           // the field in this model that ties this model to the ref model (remeber in task model we defined 
                                // a property named owner and set its value to the id of the user who is logged in )
    foreignField: "owner"      // the name of the field that ties the ref model to this model (has a re property that is set to "User")
});

// adding a new method called getAuthToken() to be accessed as an instance method
userSchema.methods.getAuthToken = async function(){
    const user = this;
    const token = jwt.sign( { _id: user._id.toString() }, process.env.JWT_SECRET);     // note that the returned value is a string
    user.tokens.push({token});
    await user.save();
    return token;
};

// this method will make res.send(user) returns the user without mongoose data, also without properties we choose to hide (delete from a copy)
userSchema.methods.toJSON = function(){
    const userProfile = this.toObject();
    delete userProfile.password;
    delete userProfile.tokens
    delete userProfile.avatar;
    return userProfile;
};

// adding a new method called findByCredentials() to be accessed as a static model method 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});    // if an exception is thrown, it will be caught when the method is called
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if(!user || !isPasswordMatch){
        throw new Error("login failed!");
    }
    return user;
};

//adding middleware functions to the schema (middleware is a function that gets called everytime before a specific method (event), in this example the method is save())
userSchema.pre("save", async function(next){
    const userDocument = this;
    if(userDocument.isModified("password")){
        userDocument.password = await bcryptjs.hash(userDocument.password, 8);
    }
    next();
});

// deletes user tasks when a user is removed
userSchema.pre("remove", async function(next){
    const userToBeDeleted = this;
    await Task.deleteMany({owner: userToBeDeleted._id});
    next();
});

// defining model for users table
const User = mongoose.model("User", userSchema);

module.exports = User;
