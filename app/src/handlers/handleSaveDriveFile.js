import {saveDriveFile} from "../utils/DriveFiles.js"

/**
 * Handle saving a file to Google Drive.
 *
 * @param {Event} evt - the event object
 * @return {void}
 */
export default function handleSaveDriveFile(evt) {
    evt.preventDefault();
    saveDriveFile(editorArea);
}