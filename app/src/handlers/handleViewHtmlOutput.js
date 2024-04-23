import { codeToHtml } from 'https://esm.sh/shiki@1.0.0'
import CreateNewModal from "../utils/CreateModal.js";
import { TransformMDToHtml } from "../modules/TransformMd";
import CopyToClipboard from "../utils/CopyToClipboard.js";
import config from "../config/lang.json";

/**
 * Function to handle the view HTML output event.
 *
 * @param {Event} evt - The event triggering the function
 */
export default function handleViewHtmlOutput(evt) {

    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.classList.add("active");

    let win = CreateNewModal({
      target: evt.target,
      title: config.outputHtml,
      width: "50%",
      height: "95%",
      html: `<div id="card" class="card-group"><div class="loader"></div></div>`,
      callback: async (options) => {

        let outputs = await Promise.all([TransformMDToHtml(editorArea)]);
        let element = document.createElement("div");
        element.textContent = outputs[0];

        win.body.innerHTML = `<div class="code-box-copy">
          <button id="copyHtmlOutput" class="code-box-copy_btn">🍺 Copy Code</button>
          <div id="outputHtml"></div>
        </div>`;

        let w = setTimeout(async () => {

          let btnCopy = document.querySelector("#copyHtmlOutput");
          let outputHtml = document.querySelector("#outputHtml");

          outputHtml.innerHTML = await codeToHtml(element.textContent, {
            lang: 'html',
            theme: 'ayu-dark'
          })

          btnCopy.addEventListener("click", (evt) =>
            CopyToClipboard(evt, outputHtml, btnCopy)
          );

          clearTimeout(w);
        }, 50);
      },
    });
}