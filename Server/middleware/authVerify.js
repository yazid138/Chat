const jwt = require('jsonwebtoken')
const {User} = require('../database/model')

const authVerify = async (req, res, next) => {
    let token = req.cookies.token || ''
    if (req.headers.authorization) {
        let [authType, token2] = req.headers.authorization.split(' ')
        if (authType === 'Bearer') token = token2
    }

    try {
        const data = jwt.verify(token, process.env.SECRET)
        try {
            req.user = await User.findByPk(data.id, {
                attributes: {
                    exclude: ['password']
                }
            })
        } catch (err) {
            return res.status(500).json({
                code: 500,
                message: "Internal server error",
                error: err.message
            })
        }
    } catch (err) {
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized',
            error: err.message
        })
    }
    next()
}

module.exports = authVerify