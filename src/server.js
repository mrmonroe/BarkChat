import WebSocket from 'ws';
import fs from 'fs';

const wss = new WebSocket.Server({ port: 3302 });

/**
 * Writes text to the chat.log
 * @param {String} text - The text to write to the file
 * @throws {String} err - Error from writing to file
 * @returns {Boolean} True if succesful
 */
function toLog(text) {
  fs.appendFile('chat.log', text, (err) => {
    if (err) {
      throw err;
    } else {
      return true;
    }
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
