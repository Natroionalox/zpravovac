const ws = require("ws");
 
const server = new ws.Server({ port: 8080 });

const sockets = [];

const history = [];
 
server.on("connection", (socket) => {

    console.log("yuh im here")
    sockets.push(socket);
    let name = "UNKNOWN" + crypto.randomUUID();
    let firstMessageRecieved = false;

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