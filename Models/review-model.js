const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
});

reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function(courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId }
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await mongoose.model('Course').findByIdAndUpdate(courseId, {
      averageRating: Math.ceil(obj[0].averageRating / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.course);
});

reviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.course);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
