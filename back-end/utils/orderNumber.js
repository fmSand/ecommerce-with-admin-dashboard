const crypto = require("crypto");

const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateOrderNumber(length = 8) {
  let orderNumber = "";
  for (let i = 0; i < length; i++) {
    orderNumber += BASE62_ALPHABET[crypto.randomInt(0, BASE62_ALPHABET.length)];
  }
  return orderNumber;
}

module.exports = { generateOrderNumber };
