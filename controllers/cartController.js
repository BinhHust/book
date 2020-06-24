const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.isShopping = (req, res, next) => {
  if (!req.session.cart) {
    return next();
  }

  const cloneItems = [...req.session.cart.items];

  if (cloneItems.length === 0) {
    res.locals.nBook = 0;
  } else {
    res.locals.nBook = cloneItems.reduce((acc, item) => acc + item.quantity, 0);
  }
  next();
};

exports.getBooksForCart = catchAsync(async (req, res, next) => {
  if (!req.session.cart) {
    return next();
  }

  const cloneItems = [...req.session.cart.items];

  if (cloneItems.length === 0) {
    res.locals.total = 0;
  } else {
    const bookIds = cloneItems.map(book => book.bookId);

    let books = await Book.find({ _id: { $in: bookIds } }).populate({
      path: 'shop',
      select: 'name'
    });

    books = books.map(book => {
      const bookId = book.id;
      const correspondItem = cloneItems.find(item => item.bookId === bookId);
      return { ...book._doc, quantity: correspondItem.quantity };
    });

    // console.log(books);
    res.locals.booksInCart = books;
    res.locals.total = books.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
  }

  next();
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);

  if (!book) {
    return next(new AppError('No book belongs to this id.', 404));
  }

  if (!req.session.cart) {
    req.session.cart = {
      items: []
    };
  }

  const cloneItems = [...req.session.cart.items];

  const bookIndex = cloneItems.findIndex(item => item.bookId === bookId);

  if (bookIndex !== -1) {
    cloneItems[bookIndex].quantity += 1;
  } else {
    cloneItems.push({
      bookId,
      quantity: 1
    });
  }

  req.session.cart.items = cloneItems;

  req.session.save(() => {
    res.status(200).json({
      status: 'success',
      message: `'${book.name}' is added to the cart successfully.`
    });
  });
});

exports.deleteToCart = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);

  if (!book) {
    return next(new AppError('No book belongs to this id.', 404));
  }

  const deletedItems = req.session.cart.items.filter(
    item => item.bookId !== bookId
  );

  req.session.cart.items = deletedItems;

  req.session.save(() => {
    res.status(200).json({
      status: 'success',
      message: `'${book.name}' is deleted to the cart successfully.`
    });
  });
});
