import SaveFileMd from "../utils/SaveFileMd.js";

/**
 * Function to handle saving a Markdown file.
 *
 * @param {Event} evt - the event triggering the save action
 * @return {void}
 */
export default function handleSaveMd(evt) {
    evt.preventDefault();
    SaveFileMd(editorArea);
}