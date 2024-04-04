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
        <div class="form-group">
          <label for="theme">${config.themecolor} <small id="label-theme"></small></label>
          <select name="theme" id="select-theme"><option selected disabled>--- ${config.selecttheme} --</option><option value="default">Theme Default</option><option value="light">Theme Light</option><option value="dark">Theme Dark</option><option value="rose">Theme Rose</option><option value="pink">Theme Pink</option><option value="fuchsia">Theme Fuchsia</option><option value="purple">Theme Purple</option><option value="violet">Theme Violet</option><option value="indigo">Theme Indigo</option><option value="blue">Theme Blue</option><option value="sky">Theme Sky</option><option value="cyan">Theme Cyan</option><option value="teal">Theme Teal</option><option value="emerald">Theme Emerald</option><option value="green">Theme Green</option><option value="lime">Theme Lime</option><option value="yellow">Theme Yellow</option><option value="amber">Theme Amber</option><option value="orange">Theme Orange</option><option value="red">Theme Red</option><option value="stone">Theme Stone</option><option value="neutral">Theme Neutral</option><option value="zinc">Theme Zinc</option><option value="gray">Theme Gray</option><option value="slate">Theme Slate</option></select>
        </div>
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
            const selectTheme = document.getElementById("select-theme");

            selectTheme.addEventListener("change", (evt) => {
                const thValue = evt.target.value;
                document.body.setAttribute("data-theme", thValue);

                Storage("Markdroids-data-theme", thValue);

                const globalSettings = {
                    style: Storage("Markdroids-custom-css"),
                    theme: Storage("Markdroids-data-theme"),
                };
            });

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