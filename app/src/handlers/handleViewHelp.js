import config from "../config/lang.json";
import CreateNewModal from "../utils/CreateModal.js";

/**
 * Function to handle the event for viewing help content.
 *
 * @param {Event} evt - the event object triggering the function
 * @return {void}
 */
export default function handleViewHelp(evt) {

    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.classList.add("active");

    let win = CreateNewModal({
      target: evt.target,
      title: config.help,
      width: "50%",
      height: "95%",
      html: `<div id="card" class="card-group"><div class="loader"></div></div>`,
      callback: async (options) => {
        const response = await fetch("./api/help.html");
        const text = await response.text();
        win.body.innerHTML = text;
      },
    });
}