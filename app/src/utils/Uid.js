/**
 * Generate a unique identifier string of a specified length.
 *
 * @param {number} len - The length of the unique identifier string to generate. Defaults to 11 if not provided.
 * @return {string} The unique identifier string generated.
 */
export default function Uid(len) {
  const HEX = [];
  for (let i = 0; i < 36; i++) {
    HEX.push(i.toString(36));
  }

  let str = "";
  const num = len || 11;
  for (let i = 0; i < num; i++) {
    str += HEX[Math.floor(Math.random() * 36)];
  }

  return str;
}
