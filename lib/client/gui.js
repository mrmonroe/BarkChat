'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = exports.inputBox = exports.outputBox = exports.screen = undefined;

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class to build a chat terminal */
var screen = _blessed2.default.screen({
  autoPadding: true,
  debug: true,
  smartCSR: true
});

var outputBox = _blessed2.default.box({
  fg: 'white',
  bg: 'default',
  tags: true,
  width: '100%',
  height: '80%',
  top: 0,
  left: 'center'
});
var inputBox = _blessed2.default.box({
  fg: 'blue',
  bg: 'default',
  tags: true,
  width: '100%',
  height: '20%',
  bottom: 0,
  left: 'center'
});

var input = _blessed2.default.textarea({
  parent: inputBox,
  bottom: 0,
  height: 1,
  cursor: 'underline',
  inputOnFocus: true,
  mouse: true,
  style: {
    fg: '#00ff00',
    underline: true
  }
});

exports.screen = screen;
exports.outputBox = outputBox;
exports.inputBox = inputBox;
exports.input = input;