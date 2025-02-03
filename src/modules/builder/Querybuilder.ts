import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields?.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['price_min', 'price_max', 'inStock', 'category'];
    excludeFields.forEach((field) => delete queryObj[field]);

    const filterConditions: Record<string, any> = {};

    // Category Filter
    if (queryObj.category && queryObj.category !== 'All') {
      filterConditions['category'] = queryObj.category;
    }

    // Price Range Filter
    if (queryObj.price_min || queryObj.price_max) {
      filterConditions['price'] = {};
      if (queryObj.price_min) {
        filterConditions['price']['$gte'] = Number(queryObj.price_min);
      }
      if (queryObj.price_max) {
        filterConditions['price']['$lte'] = Number(queryObj.price_max);
      }
    }

    // Stock Availability Filter
    if (queryObj.isStock) {
      filterConditions['inStock'] =
        queryObj.inStock === 'true' ? { $gt: 0 } : 0;
      queryObj.inStock === 'false' ? { $eq: 0 } : 0;
    }

    this.modelQuery = this.modelQuery.find(filterConditions as FilterQuery<T>);

    return this;
  }

  sort() {
    const { sortBy, sortOrder } = this.query;
    const sortOption: { [key: string]: 1 | -1 } = {};

    if (sortBy && typeof sortBy === 'string' && typeof sortOrder === 'string') {
      sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    this.modelQuery = this.modelQuery.sort(sortOption);
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 25;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 25;
    const totalPage = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPage,
    };
  }
}

export default QueryBuilder;
