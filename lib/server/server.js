'use strict';

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentUsers = [];
var serverCfg = _config2.default.get('Server.srvConfig');

var wss = new _ws2.default.Server({
  host: serverCfg.host,
  port: serverCfg.port
});
console.log('\n\nBarkChat server has started ws://' + serverCfg.host + ':' + serverCfg.port);
/**
 * Writes text to the chat.log
 * @param {String} text - The text to write to the file
 * @throws {String} err - Error from writing to file
 * @returns {Boolean} True if succesful
 */
function toLog(text) {
  var ft = (0, _dateformat2.default)(new Date(), 'yyyy_mm_dd');
  var fileName = 'logs/' + ft + '_chat.log';
  _fs2.default.appendFile(fileName, text, { flags: 'a+' }, function (err) {
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
  toLog(data + ',\n');
  client.send(JSON.stringify(data));
  return true;
}
/**
 * Builds the command results message
 * @param {object} data - Object containing message data
 * @returns {object} The msg object
 */
function parseCommand(data) {
  var msg = {
    type: 'message',
    name: 'Server',
    text: currentUsers
  };
  return msg;
}

wss.on('connection', function (ws) {
  ws.on('message', function (data) {
    var msg = '';
    var rcv = JSON.parse(data);
    switch (rcv.type) {
      case 'connect':
        currentUsers.push(rcv.name);
        var txt = 'You are connected! # of current guests: ' + wss.clients.size;
        msg = {
          type: 'message',
          name: 'Server',
          text: txt
        };
        sendData(ws, msg);
        break;
      case 'command':
        if (rcv.text == '##names') {
          msg = parseCommand(rcv);
        }
        sendData(ws, msg);
      default:
        wss.clients.forEach(function (client) {
          if (client !== ws && client.readyState === _ws2.default.OPEN) {
            sendData(client, data);
            console.log('everyone:', data);
          }
        });
        break;
    }
  });
});