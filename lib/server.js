'use strict';

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wss = new _ws2.default.Server({ port: 3302 });

function toLog(text) {
  _fs2.default.appendFile('chat.log', text, function (err) {
    if (err) {
      return console.log(err);
    }
    if (err) throw err;
  });
}

wss.on('connection', function connection(ws) {
  ws.send('You are connected! # of current guests: ' + wss.clients.size);
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      toLog(data + '\n');
      if (client !== ws && client.readyState === _ws2.default.OPEN) {
        client.send(data);
        console.log('everyone:', data);
      }
    });
  });
});