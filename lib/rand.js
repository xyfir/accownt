/**
 * Generate random integer in range (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
module.exports = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;