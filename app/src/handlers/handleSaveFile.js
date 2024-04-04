import SaveFile from "../utils/SaveFile.js";

/**
 * A function that handles saving a file.
 *
 * @param {type} evt - the event object
 * @return {type} no return value
 */
export default function handleSaveFile(evt) {
    evt.preventDefault();
    SaveFile();
}