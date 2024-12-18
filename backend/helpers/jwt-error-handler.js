export const jwtErrorHandler = (app) => {
    app.use((err, req, res, next) => {
        if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
            console.log({err })
            return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
        }

        // Handle other JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Unauthorized: ' + err.message });
        }

        // Handle other types of errors
        res.status(500).json({ error: 'Internal Server Error', detail: err.message });
    });
}