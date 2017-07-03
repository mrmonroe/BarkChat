import Blessed from 'blessed';
/** Class to build a chat terminal */
const screen = Blessed.screen({
  autoPadding: true,
  debug: true,
  smartCSR: true,
});

const outputBox = Blessed.box({
  fg: 'white',
  bg: 'default',
  tags: true,
  width: '100%',
  height: '80%',
  top: 0,
  left: 'center',
});
const inputBox = Blessed.box({
  fg: 'blue',
  bg: 'default',
  border: {
    type: 'dotted',
    fg: '#cccccc',
  },
  tags: true,
  width: '100%',
  height: '20%',
  bottom: 0,
  left: 'center',
});

const input = Blessed.textarea({
  parent: inputBox,
  bottom: 0,
  height: 3,
  inputOnFocus: true,
  mouse: true,
  border: {
    type: 'line',
    fg: '#ffffff',
  },
  style: {
    fg: '#00ff00',
  },
});

export { screen, outputBox, inputBox, input };
