import http from 'node:http';
import EventEmitter from 'node:events';
import { serveStatic } from './utils/serveStatic.js';

const PORT = 8000;
const __dirname = import.meta.dirname;

// initialize the event constructor
const statusEmitter = new EventEmitter();
let isOnline = false;


const server = http.createServer(async (req, res) => {

    if(req.url === '/api'){

    }else if(req.url === '/events'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const sendStatus = (status) => {
            res.write(`data: ${JSON.stringify({online: status})}\n\n`);
        }

        // send current status immediately
        sendStatus(isOnline);

        // register emitter to server state change
        statusEmitter.on('statusChange', sendStatus)
        req.on('close', () => {
            statusEmitter.removeListener('statusChange',sendStatus)
        });
    }else{
        await serveStatic(req, res, __dirname)
    }
})

// ---- Detect when server is online/offline ----
server.on('listening', () => {
    isOnline = true;
    statusEmitter.emit('statusChange', true)
    console.log('Server is Online!')
});

server.on('close', () => {
    isOnline = false;
    statusEmitter.emit('statusChange', false)
    console.log('Server is Offline!')
})



server.listen(PORT, () => console.log(`Connected on: http://localhost:${PORT}`))