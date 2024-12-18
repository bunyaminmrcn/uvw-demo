import { sanitize } from  "perfect-express-sanitizer"


// sanitize.prepareSanitize - basicly cleans the payload with various levels of security like xss, sql, noSql
const cleanBody = (req, res, next) => {
    const body = req.body;
    const sanitizedData = sanitize.prepareSanitize(body, { xss: true, sql: true, noSql: true, level: 5})
    req.body = sanitizedData;
    next();
}

const cleanQuery = (req, res, next) => {
    const query = req.query;
    const sanitizedData = sanitize.prepareSanitize(query, { xss: true, sql: true, noSql: true, level: 5})
    req.query = sanitizedData;
    next();
}

const cleanParams = (req, res, next) => {
    const params = req.params;
    const sanitizedData = sanitize.prepareSanitize(params, { xss: true, sql: true, noSql: true, level: 5})
    req.query = sanitizedData;
    next();
}

export { cleanBody, cleanQuery, cleanParams }