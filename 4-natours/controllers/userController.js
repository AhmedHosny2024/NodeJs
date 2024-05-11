const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Users
exports.GetAllUsers = catchAsync(async (req, res) => {
  const users = await User.find(/*{ active: { $ne: false } }*/);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.UpdateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatepassword.',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.DeleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.CreateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead'
  });
};
exports.GetUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
// exports.UpdateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined'
//   });
// };
// exports.DeleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined'
//   });
// };
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.DeleteUser = factory.deleteOne(User);
// Dont Update password with this
exports.UpdateUser = factory.updateOne(User);
exports.GetUser = factory.getOne(User);
exports.GetAllUsers = factory.getAll(User);
