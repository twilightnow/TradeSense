import hachima from './hachima.mjs'

const originalText = 'hello, world! 你好，世界！';

// Correctly handle UTF-8 strings for btoa/atob-based functions
const utf8Bytes = new TextEncoder().encode(originalText);
let binaryString = '';
for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
}

let encoded = hachima.encode(binaryString);
console.log('Encoded:', encoded);

let decodedBinary = hachima.decode(encoded);
const decodedBytes = new Uint8Array(decodedBinary.length);
for (let i = 0; i < decodedBinary.length; i++) {
    decodedBytes[i] = decodedBinary.charCodeAt(i);
}

let decodedText = new TextDecoder().decode(decodedBytes);
console.log('Decoded:', decodedText);