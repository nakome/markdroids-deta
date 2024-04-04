import Storage from "../utils/Storage.js";
import { saveBinSettings } from "../utils/DriveFiles.js";

/**
 * A function to handle toggling the theme based on the event triggered.
 *
 * @param {Event} evt - The event that triggered the theme toggle.
 */
export default function handleToggleTheme(evt) {

    let th = document.body.dataset.theme === "dark" ? "light" : "dark";
    // Update the src of the button image
    btnDarkMode.querySelector("img").src = `./api/icons/svg/${th}-mode.svg`;
    // Update the data-theme of the body
    document.body.dataset.theme = th;
    // Update the data-theme of the specific element
    window.frames[0].document.body.dataset.theme = th;

    // Update data in storage
    Storage("Markdroids-data-theme", th);

    // We update the global settings
    const globalSettings = {
        style: Storage("Markdroids-custom-css"),
        theme: Storage("Markdroids-data-theme"),
    };

    // Save the global settings
    saveBinSettings(globalSettings);
}