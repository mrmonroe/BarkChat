'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _fullname = require('fullname');

var _fullname2 = _interopRequireDefault(_fullname);

var _dateFormat = require('dateFormat');

var _dateFormat2 = _interopRequireDefault(_dateFormat);

var _ui = require('./ui.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userName = void 0;
(0, _fullname2.default)().then(function (name) {
  userName = name;
});

var client = new _ws2.default('ws://localhost:3302', {
  perMessageDeflate: false
});

client.on('open', function open() {
  client.send(getPrompt() + 'Connected');
});

client.on('message', function incoming(data) {
  _ui.outputBox.insertBottom(data);
  _ui.screen.render();
});

client.on('terminate', function incoming(data) {
  _ui.outputBox.insertBottom('Server has stopped!');
  _ui.screen.render();
});

// Quit on Escape, q, or Control-C.
_ui.input.key(['C-c'], function (ch, key) {
  return process.exit(0);
});
// Quit on Escape, q, or Control-C.
_ui.input.key(['enter'], function (ch, key) {
  _ui.outputBox.insertBottom('{green-fg}' + getPrompt() + '{/green-fg}' + _ui.input.value.trim());

  client.send(getPrompt() + _ui.input.value.trim(), function ack(error) {
    if (error) {
      console.log(error);
    }
  });
  _ui.input.clearValue();
  _ui.screen.render();
});

function getPrompt() {
  var time = new Date();
  var ft = (0, _dateFormat2.default)(time, 'mm/dd/yy hh:MM');
  var prompt = ft + ': ' + userName + ' -> ';
  return prompt;
}
function initialize() {
  _ui.screen.append(_ui.outputBox);
  _ui.screen.append(_ui.inputBox);
  _ui.screen.render();
}
exports.default = { initialize: initialize };