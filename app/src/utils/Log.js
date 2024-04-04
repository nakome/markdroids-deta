/**
 * Logs a message with custom styling to the console.
 *
 * @param {string} message - The message to be logged
 * @return {undefined}
 */
const Log = (message) => {
  let baseStyles = [
    "color: #fff",
    "background-color: #444",
    "padding: 2px 4px",
    "border-radius: 2px",
  ].join(";");
  console.log(`%cMarkdroids: ${message}`, baseStyles);
};

export default Log;