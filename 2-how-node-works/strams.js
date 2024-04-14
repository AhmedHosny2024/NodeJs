const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    // Solution 1: load everything into memory and send it all at once (not good for large files: 1GB file would crash the server run out of memory)
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err) console.log(err);
    //     res.end(data);
    // });
    // Solution 2: Streams (backpressure: slow client can't consume data as fast as the server produces it)
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', chunk => {
    //     res.write(chunk);
    // });
    // readable.on('end', () => {
    //     res.end();
    // });
    // readable.on('error', err => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found!');
    // });
    // Solution 3: pipe operator (handles backpressure for us)
    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
    // readableSource.pipe(writeableDest)


});

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests...');
});