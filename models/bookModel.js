const mongoose = require('mongoose');
const Shop = require('../models/shopModel');

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please provide a book name.']
  },
  author: {
    type: String,
    required: [true, 'Please provide a book genre.']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a book price.']
  },
  shop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shop',
    required: [true, 'Please provide a shop id.']
  }
});

// methods
bookSchema.methods.calcBookQuantity = async function(shopId) {
  const stats = await this.constructor.aggregate([
    {
      $match: {
        shop: shopId
      }
    },
    {
      $group: {
        _id: '$shop',
        nBooks: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Shop.findByIdAndUpdate(shopId, { nBooks: stats[0].nBooks });
  } else {
    await Shop.findByIdAndUpdate(shopId, { nBooks: 0 });
  }
};

// post-saved
bookSchema.post('save', async function(doc, next) {
  //
  await doc.calcBookQuantity(doc.shop);
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
