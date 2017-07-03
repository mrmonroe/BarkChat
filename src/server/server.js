import WebSocket from 'ws';
import fs from 'fs';
import config from 'config'
import dateFormat from 'dateformat';
//...
const serverCfg = config.get('Server.srvConfig');

const wss = new WebSocket.Server({
  host: serverCfg.host,
  port: serverCfg.port
});
console.log(`\n\nBarkChat server has started ws://${serverCfg.host}:${serverCfg.port}`);
/**
 * Writes text to the chat.log
 * @param {String} text - The text to write to the file
 * @throws {String} err - Error from writing to file
 * @returns {Boolean} True if succesful
 */
function toLog(text) {
    const ft = dateFormat(new Date, 'yyyy_mm_dd');
  const fileName = `logs/${ft}_chat.log`
  fs.appendFile(fileName, text, {'flags': 'a+'},(err) => {
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
