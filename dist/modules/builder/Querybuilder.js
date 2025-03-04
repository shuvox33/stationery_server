"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields === null || searchableFields === void 0 ? void 0 : searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ['price_min', 'price_max', 'inStock', 'category'];
        excludeFields.forEach((field) => delete queryObj[field]);
        const filterConditions = {};
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
        this.modelQuery = this.modelQuery.find(filterConditions);
        return this;
    }
    sort() {
        const { sortBy, sortOrder } = this.query;
        const sortOption = {};
        if (sortBy && typeof sortBy === 'string' && typeof sortOrder === 'string') {
            sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        this.modelQuery = this.modelQuery.sort(sortOption);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 25;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 25;
            const totalPage = Math.ceil(total / limit);
            return {
                total,
                page,
                limit,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
