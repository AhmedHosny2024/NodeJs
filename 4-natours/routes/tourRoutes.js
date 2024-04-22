const express = require('express');

const router = express.Router(); // middleware
const tourController = require('../controllers/tourController');

// router.param('id', tourController.checkID); // checkID middleware

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router; // export the router to be used in app.js
