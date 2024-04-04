/**
 * Reads the content of the provided file as text using FileReader.
 *
 * @param {File} file - The file to be read.
 * @return {Promise<string>} A promise that resolves with the text content of the file.
 */
export default function readFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (event) => resolve(event.target.result);
    fr.onerror = (error) => reject(error);
    fr.readAsText(file);
  });
}