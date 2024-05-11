const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// Aliasing
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Tours
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // execute query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: { tours }
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews'); // populate the guides field with the actual data from the User model

//   // Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: { tour }
//   });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   // const newTour = new Tour({});
//   // newTour.save();
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });
// });
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, // return the new document instead of the old one
//     runValidators: true // run the validators
//   });
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: { tour }
//   });
// });
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { month: -1 } // 1: ascending, -1: descending
    }
    // {
    //   $limit: 12
    // }
  ]);
  res.status(200).json({
    status: 'success',
    length: plan.length,
    data: {
      plan
    }
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const distances = await Tour.aggregate([
    {
      // only works with the first stage in the pipeline
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

exports.deleteTour = factory.deleteOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);
