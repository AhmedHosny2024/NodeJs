const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
// process.env.UV_THREADPOOL_SIZE = 1; // default is 4

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
    console.log('I/O finished');
    console.log('-----------------');
    setTimeout(() => console.log('Timer 2 finished'), 0);  // 3 this will run after the I/O finished event loop
    setTimeout(() => console.log('Timer 3 finished'), 3000);
    setImmediate(() => console.log('Immediate 2 finished'));  // 2 this will run after the I/O finished event loop before the setTimeout
    process.nextTick(() => console.log('Process.nextTick'));  // 1 this will run after the I/O finished event loop first

    // size of th thread pool is 4, so only 4 threads can run at a time
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted', Date.now() - start, 'ms');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted', Date.now() - start, 'ms');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted', Date.now() - start, 'ms');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted', Date.now() - start, 'ms');
    });
    // will take more time
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log('Password encrypted', Date.now() - start, 'ms');
    });

});

console.log('Hello from the top-level code'); // this will run first 

process.nextTick(() => console.log('Process.nextTick')); // this will run before the I/O finished event loop