import WebSocket from 'ws';
import fullname from 'fullname';
import dateFormat from 'dateformat';
import { screen, inputBox, outputBox, input } from './gui';

/**
 * Finds the full name of the user logged into the computer
 * @return {string} name - =The full name of the logged in user
 */
const userName = fullname().then(name => name);
/**
 * Builds the prompt added to the screen when a message is appended
 * @return {string} prompt - The final prompt text to be diplayed
 */
function getPrompt() {
  const time = new Date();
  const ft = dateFormat(time, 'mm/dd/yy hh:MM');
  const prompt = `${ft}: ${userName} -> `;
  return prompt;
}

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

client.on('terminate', () => {
  outputBox.insertBottom('Server has stopped!');
  screen.render();
});

input.key(['C-c'], () => { process.exit(0); });
// Quit on Escape, q, or Control-C.
input.key(['enter'], () => {
  outputBox.insertBottom(`{green-fg}${getPrompt()}{/green-fg}${input.value.trim()}`);
  client.send(getPrompt() + input.value.trim(), (error) => {
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
