import { isBase64, decodeUnicode } from "../modules/utils.js";

/**
 * Checks if the input string is encoded in base64 format and decodes it if necessary.
 *
 * @param {string} str - The input string to be checked and potentially decoded
 * @return {string|null} The decoded string if it was base64 encoded, otherwise null
 */
const checkIsBase64 = (str) => {
  try {
    const utf8Str = str.toString("utf-8");
    return isBase64(utf8Str) ? utf8Str : decodeUnicode(utf8Str);
  } catch (error) {
    // Handling any errors that may occur during conversion or decoding
    console.error("Error occurred while verifying or decoding the string:", error);
    return null;
  }
};

export default checkIsBase64;