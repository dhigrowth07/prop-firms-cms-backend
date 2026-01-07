const validateRequest = (schemas) => {
    return (req, res, next) => {
        const opts = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        const errors = [];

        const run = (schema, source, target) => {
            const { value, error } = schema.validate(req[source], opts);
            if (error) {
                console.log('error: ', error);
                errors.push(...error.details);
            } else {
                req[target] = value;
            }
        };

        if (schemas.body) run(schemas.body, "body", "body");
        if (schemas.params) run(schemas.params, "params", "params");
        if (schemas.query) run(schemas.query, "query", "query");

        if (errors.length) {
            const formatted = errors.map((err) => ({
                field: Array.isArray(err.path) ? err.path.join(".") : err.path,
                message: err.message.replace(/["]/g, ""),
            }));
            const firstMessage = formatted[0].message;
            return res.status(400).json({
                success: false,
                message: firstMessage,
                errors: formatted,
            });
        }
        next();
    };
};

module.exports = validateRequest;
