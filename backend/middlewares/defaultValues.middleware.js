
const defaultLimitNPage = (req, res, next) => {
    const query = req.query;
    let limit = 5, page = 1;

    const { page: pageStr, limit : limitStr} = query
    limit = limitStr ? (+limitStr): limit;
    page = pageStr ? (+pageStr): page;

    req.query = { ...query , page, limit }
    next();
}

export { defaultLimitNPage }