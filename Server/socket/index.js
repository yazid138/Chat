const {Message} = require("../database/model");

module.exports = (io) => {
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
}