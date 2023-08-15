require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const databaseSync = require('./database/sync')
const routes = require('./routes')
const compression = require('compression')
const http = require('http')
const {Server} = require('socket.io')
const db = require("./database/db");
const {UserMessage, Message} = require("./database/model");
const {Op} = require("sequelize");

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {origin: true}
});

const PORT = process.env.PORT || 3000;

// (async () => await databaseSync())()

app.use(cors({origin: true, credentials: true}))
app.use(compression())
app.use(logger("tiny"))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(errorhandler())

app.get('/', (req, res) => {
    return res.json({
        message: 'tes',
    })
})

app.use(routes)

app.use((req, res) => {
    return res.status(404).json({
        code: 404,
        message: 'not found',
    })
})

app.use((err, req, res, next) => {
    return res.status(500).json({
        code: 500,
        message: 'internal server error',
    })
})

const rooms = {};

io.on('connection', socket => {
    console.log('connect to websocket')

    socket.on('join-room', (roomName) => {
        socket.join(roomName);
        console.log(`User joined room: ${roomName}`);

        rooms[socket.id] = roomName;

        socket.on('leave-room', () => {
            console.log(`A user leaved room: ${roomName}`);
            socket.leave(roomName);
            delete rooms[socket.id];
        });
    })

    socket.on('typing', () => {
        const roomName = rooms[socket.id];
        if (roomName) socket.to(roomName).emit('typing', true);
    })

    socket.on('idle', () => {
        const roomName = rooms[socket.id];
        if (roomName) socket.to(roomName).emit('typing', false);
    })

    socket.on('chat-message', async ({sender, content}) => {
        const roomName = rooms[socket.id];
        if (roomName) {
            let message = await Message.create({
                userMessageId: roomName,
                userId: sender,
                content,
            })
            message = await Message.findByPk(message.id, {
                include: {
                    association: Message.User,
                    attributes: {
                        exclude: ['password']
                    }
                }
            })
            io.to(roomName).emit('chat-message', message);
            console.log(`Received message from ${socket.id} in room ${roomName}: ${message}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
        const roomName = rooms[socket.id];
        if (roomName) {
            // Keluar dari ruangan saat koneksi ditutup
            socket.leave(roomName);
            delete rooms[socket.id];
        }
    });
})

server.listen(PORT, () => {
    console.log(`berjalan di port ${PORT}`)
})