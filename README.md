# PostMan (Task-manager-api)

This project is a fully developed Task Manager app. The app uses Node js (express js) for the backend.
Frontend code is fully written by plain JavaScrpt (ES6+). No jQuery was used.
All server calls was handeled by JavaScript fetch API.

The app uses MongoDb for storing the data, it's hosted on MongoDB Atlas.

The app is hosted at : https://hassanin-task-manager.herokuapp.com

The app accepts and sends JSON, the appliction user JWT (Json Web Tokens) bearer for authorization.

There is still room for improvement like:
-----------------------------------------
1) improving Pagination.
2) Allow user to upload avatar while creating the account (right now, you add the avatar after creating the profile).
3) Allow filtering tasks by their completion state.

some of the setup end points are:

1) POST /users ---> request body: {name: (required), email: (required), password: (required), age: (optional)} 
                    response body: {
                      user: {
                        id,
                        name,
                        email,
                        password,
                        age
                      },
                      token
                    }
2) POST /users/login ---> request body: {email: (required), password: (required)} 
                          response body: {
                            user: {
                              id,
                              name,
                              email,
                              password,
                              age
                            },
                            token
                          }
3) POST /users/logout ---> request body: {)  requires authorization using takon Bearer
                          response body: {}
                    
4) PATCH /users/me ---> request body: {name: (optional), email: (optional), password: (optional), age: (optional)}   requires authorization using takon Bearer
                          response body: {
                              id,
                              name,
                              email,
                              password,
                              age
                            }
                            
                    
You can check the routers folder to see all the set up routers.

npms used:
----------
1) "bcryptjs": npm for hasing the password provided by the user.
2) "express": npm for creating and managing the server.
3) "jest": npm used for testing the app.
4) "jsonwebtoken": used for authentication by creating a uniqe token(s) for each user and verfing it.
5) "mongodb": the database used fot storing users abd ther data.
6) "mongoose": used to better manage the mongodb database.
7) "multer": used to allow the user to upload files (images) and storing them as a buffer in the database.
8) "nodemailer": used to send emails for users who join or leave the site.
9) "sharp": used to convert the uploaded image (jpg, jpeg, ..) to png.
10) "validator" used for validating fields at the database.
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
