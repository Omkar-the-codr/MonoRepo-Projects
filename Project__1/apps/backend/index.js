const express = require('express');
const http = require('http')
const WebSocket = require('ws');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const clients = new Map();

let id =0;

wss.on("connection", (ws)=>{
    clients.set(id, ws);
    const clientId = id;
    id++;
    console.log("Client connected with id", clientId);
    ws.send(JSON.stringify({type: "WELCOME", clientId}))




    ws.on('message', async (data)=>{
        let payload;
        try{
            payload = await JSON.parse(data);
        } catch(err){
            ws.send(JSON.stringify({type: "ERROR", message: "Invalid JSON"}))
            return;
        }

        const {to, message} = payload;
        if(!to || !message){
            ws.send({type: "ERROR", message: "Missing required fields"})
        }

        const target = clients.get(Number(to));
        if(target && target.readyState === WebSocket.OPEN){
            target.send(JSON.stringify({type: "MESSAGE", message}));
        }
    })
    ws.on('close', ()=>{
        clients.delete(clientId);
        console.log("Client disconnected with id", clientId);
    })
})

app.get('/', (req, res)=>{
    res.send("SErver is running");
})

server.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})