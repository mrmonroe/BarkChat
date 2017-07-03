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

//...
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
  _fs2.default.appendFile(fileName, text, { 'flags': 'a+' }, function (err) {
    if (err) {
      throw err;
    } else {
      return true;
    }
  });
}

wss.on('connection', function (ws) {
  ws.send('You are connected! # of current guests: ' + wss.clients.size);
  ws.on('message', function (data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function (client) {
      toLog(data + '\n');
      if (client !== ws && client.readyState === _ws2.default.OPEN) {
        client.send(data);
        console.log('everyone:', data);
      }
    });
  });
});