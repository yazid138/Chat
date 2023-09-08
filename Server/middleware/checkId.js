const checkId = (variableName, callback) => async (req, res, next) => {
    let data
    try {
        data = await callback(req)
    } catch (e) {
        return res.status(500).json({
            code: 500,
            message: 'Internal server error',
            error: e.message
        })
    }
    if (!data || data && data.length === 0) {
        return res.status(404).json({
            code: 404,
            message: 'Data not found'
        })
    }
    if (variableName) req[variableName] = data
    next()
}

module.exports = checkId