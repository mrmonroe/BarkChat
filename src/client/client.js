import WebSocket from 'ws';
import fullname from 'fullname';
import dateFormat from 'dateFormat';
import { screen, inputBox, outputBox, input } from './ui.js';

let userName;
fullname().then((name) => {
  userName = name;
});


const client = new WebSocket('ws://localhost:3302', {
  perMessageDeflate: false,
});

client.on('open', () => {
  client.send(`${getPrompt()}Connected`);
});

client.on('message', (data) => {
  outputBox.insertBottom(data);
  screen.render();
});

client.on('terminate', (data) => {
  outputBox.insertBottom('Server has stopped!');
  screen.render();
});

input.key(['C-c'], (ch, key) => process.exit(0));
// Quit on Escape, q, or Control-C.
input.key(['enter'], (ch, key) => {
  outputBox.insertBottom(`{green-fg}${getPrompt()}{/green-fg}${input.value.trim()}`);
  client.send(getPrompt() + input.value.trim(), (error) => {
    if (error) {
      console.log(error);
    }
  });
  input.clearValue();
  screen.render();
});

function getPrompt() {
  const time = new Date();
  const ft = dateFormat(time, 'mm/dd/yy hh:MM');
  const prompt = `${ft}: ${userName} -> `;
  return prompt;
}
function initialize() {
  screen.append(outputBox);
  screen.append(inputBox);
  screen.render();
}
export default{ initialize };
