const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
 
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ server });


server.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);;
});



console.log("yuh im here")

const sockets = [];

const history = [];
 
wss.on("connection", (socket) => {

    
    sockets.push(socket);
    let name = "UNKNOWN" + crypto.randomUUID();

    socket.on("close", () => {
        for(socket of sockets){
            socket.send(JSON.stringify({
                type: "SYSTEM",
                time: new Date().toLocaleTimeString(),
                message: name + " se odpojil :("
            }));
        }
    });

    socket.on("message", (messageData) => {
        const message = JSON.parse(messageData.toString());
        const type = message.type;


//------------------------------------LOGIC FOR RECIEVING MESSAGES------------------------------------

        switch(type) {
            case "NEW_MESSAGE": {
                let mes;
                for(let socket of sockets) {
                    mes = JSON.stringify({
                        type: "NEW_MESSAGE",
                        time: message.time,
                        message: message.message,
                        author: name
                    })
                    socket.send(mes);
                }    
                history.push(mes);    
                break;
            }
            case "NAME": {
                name = message.name;
                socket.send(JSON.stringify({
                    type: "NAME",
                    name: name
                }))
                break;
            }
            case "IMAGE": {
                try{
                let mes;
                for(let socket of sockets) {
                    mes = JSON.stringify({
                        type: "IMAGE",
                        time: message.time,
                        message: message.message,
                        author: name
                    })
                    socket.send(mes);
                }    
                history.push(mes);    
                break;
                }catch(e){
                    console.log(e);
                }
            }
        }
    });
 

    setTimeout(() => {
    socket.send(JSON.stringify({
        type: "SYSTEM",
        message: "Vítej " + name
    }));
    socket.send(JSON.stringify({
        type: "NAME",
        name: name
    }))

    for(socket of sockets){
        socket.send(JSON.stringify({
            type: "SYSTEM",
            time: new Date().toLocaleTimeString(),
            message: name + " se připojil :P"
        }));
    }

    for(let mess of history){
        socket.send(mess);
    }
}, 50);

});


app.use(express.static(path.join(__dirname, "../klient"))); 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../klient/index.html"));
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});




