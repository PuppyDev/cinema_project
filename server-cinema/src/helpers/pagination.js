// pagination.js
async function paginate(model, page, limit, options = {}) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < model.length) {
        results.next = {
            page: page + 1,
            limit: limit,
            ...options,
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
            ...options,
        };
    }

    const query = model.find(options.search);
    query.skip(startIndex).limit(limit);

    const totalItem = await model.find(options.search).countDocuments();
    results.data = await query.exec();

    Object.assign(results, {
        total: totalItem,
        totalPage: Math.round(totalItem / limit) || 1,
        currentPage: page,
        limit: limit,
    });
    return results;
}

module.exports = paginate;
