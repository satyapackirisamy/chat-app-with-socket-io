const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);

// Socket.io connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Broadcast when a user sends a message
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

