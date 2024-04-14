const EventEmitter = require('events');
const http = require('http');

class TEST extends EventEmitter {
    constructor() {
        super();
    }
}
const myEmitter = new TEST();

myEmitter.on('TEST_EVENT', () => {
    console.log('TEST_EVENT was fired');
});
myEmitter.on('TEST_EVENT', () => {
    console.log('Test 2  was fired');
});
myEmitter.on('TEST_EVENT', (num) => {
    console.log('Test 3  was fired', num);
});

myEmitter.emit('TEST_EVENT', 9);

////////////////////////////

const server = http.createServer();

// prints twice as the browser sends two requests (favicon.ico) and / 
server.on('request', (req, res) => {
    console.log('Request received');
    res.end('Request received');
});
server.on('request', (req, res) => {
    console.log('Another Request received 🤔');
});

server.on('close', () => {
    console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests...');
});