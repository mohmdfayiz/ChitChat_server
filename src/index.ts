import 'dotenv/config';
import connectDB from './config/connection'
import express, { Express, Request, Response } from "express";
import http from 'http'
import cors from 'cors'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import morgan from "morgan"
import cookieparser from 'cookie-parser'
import { Server } from 'socket.io';
import createHttpError from 'http-errors';
import { errorHandler } from './middleware/errorHandler';
import { auth } from './middleware/auth';

const app: Express = express();
const server = http.createServer(app);
app.use(cors());

app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }))
app.use(cookieparser())
app.use(morgan('combined'))

// Health check
app.get('/', (req: Request, res: Response) => res.status(200).json({ message: 'Hello' }))

// API endpoints
app.use('/api/auth/', authRoutes)
app.use(auth) // auth middleware
app.use('/api/chat/', chatRoutes)

app.use(() => { throw createHttpError(404, 'Route not found') });
app.use(errorHandler);

// Socket setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END_URL,
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Access',
            'Authorization'
        ]
    }
})

// Socket connection
io.on('connection', (socket) => {

    // send message event
    socket.on('send-msg', (data) => {

        // broadcast message to other users
        socket.broadcast.emit('msg-received', data)
    })

    // handle disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// DB & server connection
const port = process.env.PORT || 3000
const dbConnectionString = process.env.MONGO_CONNECTION_STRING as string
connectDB(dbConnectionString).then(() => {
    server.listen(port, () => {
        console.log(`server listening on http://localhost:${port}`);
    })
})