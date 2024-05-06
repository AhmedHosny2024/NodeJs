const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router(); // middleware

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateme', authController.protect, userController.UpdateMe);
router.delete('/deleteme', authController.protect, userController.DeleteMe);

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
