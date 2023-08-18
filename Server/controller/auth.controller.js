const validation = require('../middleware/validation')
const {User} = require('../database/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const register = [
    validation(
        {
            name: 'string',
            username: 'string',
            password: 'string'
        },
        'body'
    ),
    async (req, res) => {
        let {password} = req.body
        req.body.password = await bcrypt.hash(password, bcrypt.genSaltSync())
        try {
            await User.create(req.body)
        } catch (err) {
            return res.status(400).json({
                code: 400,
                message: "gagal membuat user",
                error: err.errors[0].message || err.message
            })
        }
        return res.status(201).json({
            code: 201,
            message: "berhasil membuat user",
        })
    }
]

const login = [
    validation(
        {
            username: 'string',
            password: 'string'
        },
        'body'
    ),
    async (req, res) => {
        const {username, password} = req.body
        const user = await User.findOne({
            where: {
                username,
            }
        })
        const checkPassword = user ? await bcrypt.compare(password, user.password) : false
        if (!checkPassword) {
            return res.status(400).json({
                code: 400,
                message: "gagal login",
            })
        }
        const token = jwt.sign({id: user.id}, process.env.SECRET, {expiresIn: '1h'})
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // maxAge: 60 * 60,
            // sameSite: 'none',
            expires: moment().add(1, 'hour').toDate()
        })
        return res.json({
            code: 200,
            message: "berhasil login",
            data: {
                token
            }
        })
    }]

const detailUser = async (req, res) => {
    return res.json({
        code: 200,
        message: "berhasil mengambil detail user",
        data: req.user,
    })
}

const logout = async (req, res) => {
    res.clearCookie('token')
    return res.json({
        code: 200,
        message: "berhasil logout",
    })
}

module.exports = {register, login, logout, detailUser}