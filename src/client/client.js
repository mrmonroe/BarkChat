import WebSocket from 'ws';
import fullname from 'fullname';
import dateFormat from 'dateformat';
import { screen, inputBox, outputBox, input } from './gui';

let userName = '';
/**
 * Finds the full name of the user logged into the computer
 * @return {string} name - =The full name of the logged in user
 */
fullname().then((name) => { userName = name; });
/**
 * Creates formatted date string
 * @return {string} The formatted date string
 */
function getDate() {
  const time = new Date();
  return dateFormat(time, 'mm/dd/yy hh:MM:ss');
}
/**
 * Builds the prompt added to the screen when a message is appended
 * @param {string} name - The username of the client
 * @return {string} prompt - The final prompt text to be diplayed
 */
function getPrompt(name) {
  const ft = getDate();
  const prompt = `${ft}: ${name} -> `;
  return prompt;
}

const client = new WebSocket('ws://localhost:3302', {
  perMessageDeflate: false,
});

client.on('open', () => {
  const msg = {
    type: 'connect',
    name: userName,
    timestamp: getDate(),
  };
  client.send(JSON.stringify(msg));
});

client.on('message', (data) => {
  const rcv = JSON.parse(data);
  outputBox.insertBottom(getPrompt(rcv.name) + rcv.text);
  screen.render();
});

client.on('terminate', () => {
  outputBox.insertBottom('Server has stopped!');
  screen.render();
});

input.key(['C-c'], () => { process.exit(0); });
// Quit on Escape, q, or Control-C.
input.key(['enter'], () => {
  const txt = input.value.trim();
  outputBox.insertBottom(`{green-fg}${getPrompt(userName)}{/green-fg}${txt}`);
  let msgType = 'message';
  if (txt.search('##') !== -1) {
    msgType = 'command';
  }
  const msg = {
    type: msgType,
    name: userName,
    text: txt,
    timestamp: getDate(),
  };

  client.send(JSON.stringify(msg), (error) => {
    if (error) {
      console.log(error);
    }
  });
  input.clearValue();
  screen.render();
});

/**
 * initializes the chat client
 * @returns {boolean} Status of the initialize call
 */
function initialize() {
  screen.append(outputBox);
  screen.append(inputBox);
  screen.render();
}
export default{ initialize };
