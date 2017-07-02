import Blessed from 'blessed';
/** Class to build a chat terminal */
let screen = Blessed.screen({
  autoPadding: true,
  debug: true,
  smartCSR: true
});

let outputBox = Blessed.box({
  fg: 'white',
  bg: 'default',
  border: {
    type: 'dotted',
    fg: '#cccccc'
  },
  tags: true,
  width: '100%',
  height: '80%',
  top: 0,
  left: 'center'
});
let inputBox = Blessed.box({
  fg: 'blue',
  bg: 'default',
  border: {
    type: 'dotted',
    fg: '#cccccc'
  },
  tags: true,
  width: '100%',
  height: '20%',
  bottom: 0,
  left: 'center'
});

let input = Blessed.textarea({
    parent: inputBox,
    bottom: 0,
    height: 3,
    inputOnFocus: true,
    mouse: true,
    border: {
      type: 'line',
      fg: '#ffffff'
    },
    style: {
        fg: '#00ff00'
    }
});

export { screen, outputBox, inputBox, input};
