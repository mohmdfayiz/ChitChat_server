import 'dotenv/config'
import express, { Express, Request, Response } from "express";
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io';

const app: Express = express();
const server = http.createServer(app);
app.use(cors())

const io = new Server(server
    // , {
    // cors: {
    //     origin: process.env.FRONT_END_URL,
    //     credentials: true,
    //     allowedHeaders: [
    //         'Content-Type',
    //         'Access',
    //         'Authorization'
    //     ]
    // }}
    )

io.on('connection', (socket) => {
    console.log('a user connected with id : ',socket.id );
  });

const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => res.status(200).json({ message: 'Hello' }))

server.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
})