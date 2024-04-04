/**
 * Capitalize
 *
 * @param {string} str
 * @returns
 */
export default function Capitalize(str) {
  return str && str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
