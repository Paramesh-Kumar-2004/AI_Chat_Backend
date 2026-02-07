

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;           // Mongoose query
        this.queryString = queryString; // req.query
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'limit', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        this.query = this.query.find(queryObj);
        return this;
    }

    search(fields = []) {
        if (!this.queryString.search) return this;

        this.query = this.query.find({
            $or: fields.map(field => ({
                [field]: { $regex: this.queryString.search, $options: 'i' }
            }))
        });
        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}


export default APIFeatures;