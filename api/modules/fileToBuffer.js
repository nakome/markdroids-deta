/**
 * Converts an image into a buffer.
 * @param {File} file - The image archive.
 * @returns {Buffer} - The image buffer.
 */
const fileToBuffer = async (file) => {
  try {
    // Get the image buffer asynchronously
    const buffer = await file.arrayBuffer();

    // Create a new buffer from the obtained buffer
    const content = Buffer.from(buffer);

    return content;
  } catch (error) {
    // Handling any errors that may occur during conversion
    console.error("An error occurred while converting buffered image:", error);
    return null;
  }
};

export default fileToBuffer;