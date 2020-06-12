class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObjectClone = { ...this.queryObject };

    // exclude
    const filterFields = ['sort', 'fields', 'page', 'limit'];
    filterFields.forEach(el => {
      if (queryObjectClone.el) delete queryObjectClone[el];
    });

    // replace
    let queryString = JSON.stringify(queryObjectClone);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createAt');
    }

    return this;
  }

  limitFields() {
    if (this.querrObject.fields) {
      const selectBy = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(selectBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const limit = this.queryObject.limit || 100;
    const page = this.queryObject.page || 1;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
