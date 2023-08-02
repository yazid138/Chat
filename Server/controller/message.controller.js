const validation = require('../middleware/validation')
const {Message, User, UserMessage} = require('../database/model')
const {Op} = require('sequelize')
const checkId = require('../middleware/checkId')
const db = require('../database/db')

const create = [
    validation({
            receiver: 'number',
            content: 'string',
        },
        'body'
    ),
    async (req, res) => {
        const user = req.user
        const {receiver, content} = req.body
        const t = await db.transaction()
        try {
            let userMessage = await UserMessage.findOne({
                where: {
                    [Op.or]: [
                        {
                            user1: user.id,
                            user2: receiver,
                        },
                        {
                            user1: receiver,
                            user2: user.id,
                        }
                    ]
                }
            })
            if (!userMessage) {
                userMessage = await UserMessage.create({
                    user1: user.id,
                    user2: receiver,
                })
            }
            await Message.create({
                userMessageId: userMessage.id,
                userId: user.id,
                content,
            })
            await t.commit()
        } catch (error) {
            await t.rollback()
            return res.status(500).json({
                code: 500,
                message: 'terjadi error',
                error
            })
        }
        return res.status(201).json({
            code: 201,
            message: 'berhasil membuat pesan'
        })
    }
]

const getUserReceiver = async (req, res) => {
    const user = req.user
    let receivers;
    try {
        const userMessage = await UserMessage.findAll({
            where: {
                [Op.or]: [
                    {
                        user1: user.id,
                    },
                    {
                        user2: user.id,
                    }
                ]
            },
        })
        receivers = await User.findAll({
            where: {
                id: userMessage.map(e => e.user1 !== user.id ? e.user1 : e.user2)
            },
            attributes: {
                exclude: ['password']
            },
            raw: true,
        })
        receivers = receivers.map(e => {
            e.messageId = userMessage.find(e2 => e2.user1 === e.id || e2.user2 === e.id).id
            return e
        })
    } catch (err) {
        return res.status(500).json({
            code: 500,
            message: 'terjadi error',
            error: err.message
        })
    }
    return res.status(200).json({
        code: 200,
        message: 'berhasil mengambil user penerima',
        data: receivers
    })
}

const getMessageByUser = [
    checkId((req) => {
        const {userId} = req.params
        const user = req.user
        return UserMessage.findOne({
            where: {
                [Op.or]: [
                    {
                        user1: userId,
                        user2: user.id,
                    },
                    {
                        user1: user.id,
                        user2: userId,
                    }
                ]
            }
        })
    }, 'userMessage'),
    async (req, res) => {
        const userMessage = req['userMessage']
        let messages
        try {
            messages = await Message.findAll({
                attributes: {
                    exclude: ["userMessageId", "userId"]
                },
                where: {
                    userMessageId: userMessage.id
                },
                include: {
                    association: Message.User,
                    attributes: {
                        exclude: ['password']
                    }
                }
            })
        } catch (err) {
            return res.status(500).json({
                code: 500,
                message: 'terjadi error',
                error: err.message
            })
        }
        return res.status(200).json({
            code: 200,
            message: 'berhasil mengambil pesan',
            data: messages
        })
    }
]

module.exports = {create, getUserReceiver, getMessageByUser}