const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('../models/userModel');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please provide a shop name.']
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide a shop description.']
    },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a shop manager.'],
      unique: true
    },
    nBooks: Number
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// virtual populate
shopSchema.virtual('books', {
  ref: 'Book',
  foreignField: 'shop',
  localField: '_id'
});

// instance methods
shopSchema.methods.updateRole = async function(userId, shopId) {
  await User.findByIdAndUpdate(
    userId,
    { role: 'manager', shop: shopId },
    {
      runValidators: true
    }
  );
};

// document middleware
shopSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

shopSchema.post('save', async function(doc, next) {
  await doc.updateRole(doc.manager, doc._id);
  next();
});

// query middleware
shopSchema.pre(/^find/, function(next) {
  this.populate('manager');
  next();
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
