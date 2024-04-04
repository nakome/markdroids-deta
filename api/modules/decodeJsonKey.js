import { decodeUnicode } from "../modules/utils.js";

/**
 * Decode the given base64 encoded JSON key and return the parsed JSON object.
 *
 * @param {string} key - The base64 encoded JSON key to decode
 * @return {object} The parsed JSON object, or null if the key is invalid
 */
const decodeJsonKey = (key) => {
  try {
    // Decode base64 key
    const decodeBase64 = decodeUnicode(key);

    let toJson;
    try {
      toJson = JSON.parse(decodeBase64);
    } catch (error) {
      // Handling the case of an invalid string
      console.error("The string is not a valid JSON");
      return null;
    }

    return toJson;
  } catch (error) {
    // Handle any other errors
    console.error("An error occurred while decoding the key.:", error);
    return null;
  }
};

export default decodeJsonKey;