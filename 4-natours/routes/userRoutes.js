const express = require('express');
const userRouter = express.Router(); // middleware
const userController = require('../controllers/userController');

userRouter.route('/')
    .get(userController.GetAllUsers)
    .post(userController.CreateUser);

userRouter.route('/:id')
    .get(userController.GetUser)
    .patch(userController.UpdateUser)
    .delete(userController.DeleteUser);

module.exports = userRouter; // export the router to be used in app.js