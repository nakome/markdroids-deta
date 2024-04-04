import config from "../config/lang.json";
import CreateNewModal from "../utils/CreateModal.js";

import {
    fetchDriveFiles,
    loadDriveFile,
    deleteDriveFile,
    togglePublicDriveFile,
    updateDriveFile
} from "../utils/DriveFiles.js";

/**
 * Handle the event to view drive files.
 *
 * @param {Event} evt - The event object
 * @return {void}
 */
export default function handleViewDriveFiles(evt) {

    evt.target.disabled = true;
    evt.target.classList.add("active");

    let win = CreateNewModal({
        target: evt.target,
        title: config.detafiles,
        width: "50%",
        height: "95%",
        html: `<div id="card" class="card-group"><div class="loader"></div></div>`,
        callback: async (options) => {

            let html = await fetchDriveFiles();
            document.getElementById("card").innerHTML = html;

            loadDriveFile(evt, win);
            togglePublicDriveFile();
            updateDriveFile();
            deleteDriveFile();
        },
    });
}