const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const clients = new Map();

let id =0;
wss.on("connection", (ws)=>{
    const clientId = id;
    id++;
    clients.set(clientId, ws);


    console.log("Client connected", clientId);
    ws.send(JSON.stringify({type: "WELCOME", clientId}));


    ws.on('message', async (data)=>{
        let payload;
        try{
            payload = await JSON.parse(data.toString());
        } catch(err){
            ws.send(JSON.stringify({type: "ERROR", message: "Invalid JSON"}));
            return;
        }


        const {to, message} = payload;
        if(!to || !message){
            ws.send(JSON.stringify({type: "ERROR", message: "Missing to or message"}));
            return;
        }
        const target = clients.get(Number(to));
        if(target && target.readyState === WebSocket.OPEN){
            target.send(JSON.stringify({type
                : "MESSAGE", from: clientId, message}));
                console.log("Message sent from ", clientId, "to", to);
        } else{
            ws.send(JSON.stringify({type: "ERROR", message: "Target client not found"}));
        }
    })
    ws.on("close", ()=>{
        clients.delete(clientId);
        console.log("Client disconnected");
    })
})

app.get("/", (req, res)=>{
    res.json("WebSocket Server is running");
});

server.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});