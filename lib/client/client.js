'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _fullname = require('fullname');

var _fullname2 = _interopRequireDefault(_fullname);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _gui = require('./gui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userName = '';
/**
 * Finds the full name of the user logged into the computer
 * @return {string} name - =The full name of the logged in user
 */
(0, _fullname2.default)().then(function (name) {
  userName = name;
});
/**
 * Builds the prompt added to the screen when a message is appended
 * @return {string} prompt - The final prompt text to be diplayed
 */
function getPrompt() {
  var time = new Date();
  var ft = (0, _dateformat2.default)(time, 'mm/dd/yy hh:MM');
  var prompt = ft + ': ' + userName + ' -> ';
  return prompt;
}

var client = new _ws2.default('ws://localhost:3302', {
  perMessageDeflate: false
});

client.on('open', function () {
  client.send('name::' + userName);
});

client.on('message', function (data) {
  _gui.outputBox.insertBottom(data);
  _gui.screen.render();
});

client.on('terminate', function () {
  _gui.outputBox.insertBottom('Server has stopped!');
  _gui.screen.render();
});

_gui.input.key(['C-c'], function () {
  process.exit(0);
});
// Quit on Escape, q, or Control-C.
_gui.input.key(['enter'], function () {
  _gui.outputBox.insertBottom('{green-fg}' + getPrompt() + '{/green-fg}' + _gui.input.value.trim());
  client.send(getPrompt() + _gui.input.value.trim(), function (error) {
    if (error) {
      console.log(error);
    }
  });
  _gui.input.clearValue();
  _gui.screen.render();
});

/**
 * initializes the chat client
 * @returns {boolean} Status of the initialize call
 */
function initialize() {
  _gui.screen.append(_gui.outputBox);
  _gui.screen.append(_gui.inputBox);
  _gui.screen.render();
}
exports.default = { initialize: initialize };