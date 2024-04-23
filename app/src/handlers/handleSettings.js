import config from "../config/lang.json";
import Storage from "../utils/Storage.js";
import CreateNewModal from "../utils/CreateModal.js";
import { saveBinSettings } from "../utils/DriveFiles.js";
import customCss from "../styles/default.css?raw";

/**
 * Function to handle settings.
 *
 * @param {Event} evt - the event triggering the function
 * @return {void}
 */
export default function handleSettings(evt) {

    evt.target.disabled = true; // Disable the button
    evt.target.classList.add("active"); // Activate the button

    let css = Storage("Markdroids-custom-css")
        ? Storage("Markdroids-custom-css")
        : customCss;

    let theme = Storage("Markdroids-data-theme")
        ? Storage("Markdroids-data-theme")
        : "light";

    let template = `<div class="settings">
        <textarea id="settings" name="settings" spellcheck="false" placeholder="${config.modal.label}">${css}</textarea>
        <button class="button" id="saveSettings" type="button" title="Save settings">${config.modal.save}</button>
        </div>`

    let win = CreateNewModal({
        target: evt.target,
        title: config.settings,
        html: template,
        callback: (options) => {
            const btn = document.getElementById("saveSettings");
            const textarea = document.getElementById("settings");

            btn.addEventListener("click", (evt) => {
                const value = textarea.value;

                Storage("Markdroids-custom-css", value);

                saveBinSettings({ style: value ? value : customCss, theme: theme });

                evt.target.textContent = config.modal.saved;
                let w = setTimeout(() => {
                    evt.target.textContent = config.modal.save;
                    clearTimeout(w);
                }, 1000);
            });
        },
    });
}