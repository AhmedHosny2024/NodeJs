/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // validator
      unique: true, // the name is unique
      trim: true, // remove all the white spaces in the beginning and end of the string
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'] // custom validator
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666666666667 => 46.66666666666667 => 47 => 4.7
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true, // remove all the white spaces in the beginning and end of the string
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String], // array of strings
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date], // array of dates
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// but not .insertMany() or .update()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});
// AGGREGATION MIDDLEWARE 
// we comment this because we want to run geoNear aggregation in tourController.js (first stage of the aggregation pipeline)
// here we use regular expression to match all the aggregate methods(aggregate)
// tourSchema.pre('aggregate', function (next) {
//   // add a new stage at the beginning of the pipeline
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  })
  next();
});

// QUERY MIDDLEWARE
// hide the secret tours from the query results
// here we use regular expression to match all the find methods(find, findOne, findOneAndDelete, findOneAndRemove, findOneAndUpdate)
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// this is a post middleware will run after the document is saved
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});



tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
