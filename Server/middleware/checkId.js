const checkId = (callback, variable) => async (req, res, next) => {
    let data
    try {
        data = await callback(req)
    } catch (e) {
        return res.status(500).json({
            code: 500,
            message: 'tidak ada data',
            error: e.message
        })
    }
    console.log(data)
    if (!data || data && data.length === 0) {
        return res.status(404).json({
            code: 404,
            message: 'tidak ada data',
        })
    }
    if (variable) req[variable] = data
    next()
}

module.exports = checkId