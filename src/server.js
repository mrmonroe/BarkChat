import WebSocket from 'ws';
import fs from 'fs';

const wss = new WebSocket.Server({ port: 3302 });

function toLog(text) {
  fs.appendFile('chat.log', text, (err) => {
    if (err) {
      return console.log(err);
    }
    if (err) throw err;
  });
}

wss.on('connection', (ws) => {
  ws.send(`You are connected! # of current guests: ${wss.clients.size}`);
  ws.on('message', (data) => {
    // Broadcast to everyone else.
    wss.clients.forEach((client) => {
      toLog(`${data}\n`);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
        console.log('everyone:', data);
      }
    });
  });
});
