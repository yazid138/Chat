const Validator = require("fastest-validator");

const validation = (schema, valueFrom) => (req, res, next) => {
    const v = new Validator();
    const check = v.compile(schema);
    const validationError = check(valueFrom(req))
    if (validationError.length) {
        return res.status(400).json({
            message: 'Validation Error',
            error: validationError
        })
    }
    next()
}

module.exports = validation