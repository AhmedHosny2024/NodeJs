const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router(); // middleware

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(userController.GetAllUsers)
  .post(userController.CreateUser);
router
  .route('/:id')
  .get(userController.GetUser)
  .patch(userController.UpdateUser)
  .delete(userController.DeleteUser);

module.exports = router; // export the router to be used in app.js
