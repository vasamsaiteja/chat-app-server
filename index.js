const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
app.use(cors())
require('dotenv').config()

const port = process.env.PORT || 3001

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`)

	socket.on('join_room', (data) => {
		socket.join(data)
		console.log(`User with ID: ${socket.id} joined room: ${data}`)
	})

	socket.on('send_message', (data) => {
		socket.to(data.room).emit('receive_message', data)
	})

	socket.on('disconnect', () => {
		console.log('User Disconnected', socket.id)
	})
})

app.get('/', (req, res) => {
	res.send(process.env.SECRET_KEY)
})

server.listen(port, () => {
	console.log('SERVER RUNNING')
})