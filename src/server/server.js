import WebSocket from 'ws';
import fs from 'fs';
import config from 'config';
import dateFormat from 'dateformat';

const currentUsers = [];
const serverCfg = config.get('Server.srvConfig');

const wss = new WebSocket.Server({
  host: serverCfg.host,
  port: serverCfg.port,
});
console.log(`\n\nBarkChat server has started ws://${serverCfg.host}:${serverCfg.port}`);
/**
 * Writes text to the chat.log
 * @param {String} text - The text to write to the file
 * @throws {String} err - Error from writing to file
 * @returns {Boolean} True if succesful
 */
function toLog(text) {
  const ft = dateFormat(new Date(), 'yyyy_mm_dd');
  const fileName = `logs/${ft}_chat.log`;
  fs.appendFile(fileName, text, { flags: 'a+' }, (err) => {
    if (err) {
      throw err;
    } else {
      return true;
    }
  });
}
/**
 * Logs an sends data through the socket
 * @param {Object} client - Client to which the message is sent
 * @param {object} data - Obkect containing message data
 * @returns {Boolean} True if succesful
 */
function sendData(client, data) {
  toLog(`${data},\n`);
  client.send(JSON.stringify(data));
  return true;
}
/**
 * Builds the command results message
 * @param {object} data - Object containing message data
 * @returns {object|boolean} The msg object or false if nothinf to return
 */
function parseCommand(data) {
  switch (data.text) {
    case '##names': {
      const msg = {
        type: 'message',
        name: 'Server',
        text: currentUsers,
      };
      return msg;
    }
    default: {
      return false;
    }


  }
}

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let msg = '';
    const rcv = JSON.parse(data);
    switch (rcv.type) {
      case 'connect': {
        currentUsers.push(rcv.name);
        const txt = `You are connected! # of current guests: ${wss.clients.size}`;
        msg = {
          type: 'message',
          name: 'Server',
          text: txt,
        };
        sendData(ws, msg);
        break;
      }
      case 'command': {
        msg = parseCommand(rcv);
        sendData(ws, msg);
        break;
      }
      default: {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            sendData(client, data);
            console.log('everyone:', data);
          }
        });
        break;
      }
    }
  });
});
