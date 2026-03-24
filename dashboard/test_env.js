const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const key = process.env.FIREBASE_PRIVATE_KEY;
console.log("Raw key start:", key.substring(0, 30));
console.log("Key includes literal \\n:", key.includes('\\n'));
console.log("Key includes actual newline:", key.includes('\n'));

const processed = key.replace(/\\n/g, '\n');
console.log("Processed key start:", processed.substring(0, 30));
console.log("Processed key includes actual newline:", processed.includes('\n'));
