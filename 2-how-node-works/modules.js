// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(2, 5));

// exports
// const calc2 = require('./test-module-2');
// console.log(calc2.add(2, 5));
const { add } = require('./test-module-2');
console.log(add(2, 5));

// caching
// require('./test-module-3'); // the first log only 
require('./test-module-3')(); // fist log and the second log
require('./test-module-3')(); // second log only as it loads before
require('./test-module-3')(); 
