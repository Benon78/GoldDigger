import http from 'node:http';
import EventEmitter from 'node:events';
import dotenv from 'dotenv'
import { serveStatic } from './utils/serveStatic.js';
import { getGoldPrice } from './utils/getLivePrice.js';
import { handlePost } from './controllers/handlePostController.js';

dotenv.config();
const PORT = 8000;
const __dirname = import.meta.dirname;


// initialize the event constructor
const statusEmitter = new EventEmitter();
let isOnline = false;
let goldPrice = getGoldPrice()

// update gold price every 2 seconds and emit event
setInterval(() =>{ 
    goldPrice = getGoldPrice();
    statusEmitter.emit('priceUpdate', goldPrice)
},3000)


const server = http.createServer(async (req, res) => {

    if(req.url === '/api/purchase'){
        if(req.method === 'POST'){
          return await handlePost(req, res, __dirname)
        }

    }else if(req.url === '/events'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // send initial status
         res.write(`data: ${JSON.stringify({ online: isOnline, goldPrice })}\n\n`);

        // send updates when status or price changes
        const sendStatus = (status) => res.write(`data: ${JSON.stringify({ online: status, goldPrice })}\n\n`);
        const sendPrice = (price) => res.write(`data: ${JSON.stringify({ online: isOnline, goldPrice: price })}\n\n`);

        statusEmitter.on('statusChange', sendStatus);
        statusEmitter.on('priceUpdate', sendPrice);

        // register emitter to server state change
        statusEmitter.on('statusChange', sendStatus)
        req.on('close', () => {
            statusEmitter.removeListener('statusChange',sendStatus)
            statusEmitter.removeListener('priceUpdate', sendPrice)
        });
    }else{
        await serveStatic(req, res, __dirname)
    }
})

// ---- Detect when server is online/offline ----
server.on('listening', () => {
    isOnline = true;
    statusEmitter.emit('statusChange', isOnline)
    console.log('Server is Online!')
});

server.on('close', () => {
    isOnline = false;
    statusEmitter.emit('statusChange', isOnline)
    console.log('Server is Offline!')
})


server.listen(PORT, () => console.log(`Connected on: http://localhost:${PORT}`))