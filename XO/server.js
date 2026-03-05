const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let waitingPlayer = null;

wss.on("connection", ws => {

    if (!waitingPlayer) {
        waitingPlayer = ws;
        ws.send(JSON.stringify({ type: "waiting" }));
    } else {

        const p1 = waitingPlayer;
        const p2 = ws;

        p1.symbol = "X";
        p2.symbol = "O";

        p1.opponent = p2;
        p2.opponent = p1;

        p1.send(JSON.stringify({ type: "start", symbol: "X" }));
        p2.send(JSON.stringify({ type: "start", symbol: "O" }));

        waitingPlayer = null;
    }

    ws.on("message", msg => {

        const data = JSON.parse(msg);

        if (ws.opponent) {
            ws.opponent.send(JSON.stringify({
                type: "move",
                index: data.index,
                symbol: data.symbol
            }));
        }
    });

    ws.on("close", () => {
        if (waitingPlayer === ws) waitingPlayer = null;
    });

});

server.listen(3000, () => {
    console.log("XO Server running on port 3000");
});
