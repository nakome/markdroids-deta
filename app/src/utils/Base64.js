/**
 * Encode string
 *
 * @param {string} str - The input string
 * @returns {string} - The encoded string
 */
export function encodeUnicode(str) {
  try {
    // First, we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          let n = `0x${p1}`;
          return String.fromCharCode(n);
        }
      )
    );
  } catch (error) {
    console.error("Error encoding to Base64:", error.message);
    return null;
  }
}

/**
 * Decode string
 *
 * @param {string} str - The input string
 * @returns {string} - The decoded string
 */
export function decodeUnicode(str) {
  try {
    // Check if the string is valid Base64 before decoding
    if (/^[A-Za-z0-9+/=]+$/.test(str)) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(
        atob(str)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    } else {
      // If not Base64-encoded, return the original string
      return str;
    }
  } catch (error) {
    console.error("Error decoding from Base64:", error.message);
    return null;
  }
}


/**
 * Check if the text is Base64-encoded
 *
 * @param {string} text - The input text
 * @returns {boolean} - True if the text is Base64-encoded, false otherwise
 */
export function isBase64(text) {
  try {
    // Attempt to decode the text in Base64
    const decoded = decodeUnicode(text);
    // Check if decoding is successful
    if (decoded !== null) {
      for (let i = 0; i < decoded.length; i++) {
        const chart = decoded.charCodeAt(i);
        if (!(chart > 31 && chart < 128)) {
          // If a non-printable character is encountered, returns false.
          return false;
        }
      }
      // Checks if the original and decoded text are the same
      return encodeUnicode(decoded) === text;
    } else {
      // If there was an error decoding, return false
      return false;
    }
  } catch (error) {
    console.error("Error checking Base64:", error.message);
    return false;
  }
}