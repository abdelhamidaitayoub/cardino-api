class ApiResources {
  constructor(query, queryString) {
    this.queryString = queryString;
    this.query = query;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludedFields = ['sort', 'limit', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2: ADVANCED FILTERS
    queryObj = JSON.stringify(queryObj).replace(/\bgte?|lte?\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryObj));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortFields = this.queryString.sort.replace(/,/g, ' ');
      this.query = this.query.sort(sortFields);
    } else this.query = this.query.sort('-createdAt');

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replace(/,/g, ' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiResources;
