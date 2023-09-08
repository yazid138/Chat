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
const socket = require('./socket')

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

socket(io)

server.listen(PORT, () => {
    console.log(`berjalan di port ${PORT}`)
})