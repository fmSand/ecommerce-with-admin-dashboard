const crypto = require("crypto");

const BASE36_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateOrderNumber(length = 8) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += BASE36_ALPHABET[crypto.randomInt(0, BASE36_ALPHABET.length)];
  }

  return result;
}

module.exports = { generateOrderNumber };
