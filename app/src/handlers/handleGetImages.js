import config from "../config/lang.json";
import CreateNewModal from "../utils/CreateModal.js";
import {loadImageFiles, saveImageFile}  from "../utils/DriveFiles.js";

let template = `
<div class="card-images">
  <form method="post" enctype="multipart/form-data" id="form">
    <input type="file" id="file" name="file" accept="image/*">
  </form>
  <div id="info" class="card-images-info">Please upload an image with a size less than 2MB.</div>
  <div id="images" class="card-images-list">
    <div class="loader"></div>
  </div>
</div>`;

/**
 * Handles the event for getting images. Prevents default behavior, disables the target element,
 * and creates a new modal window to display image files.
 *
 * @param {Event} evt - the event triggering the function
 * @return {void}
 */
export default function handleGetImages(evt) {

    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.classList.add("active");

    let win = CreateNewModal({
      target: evt.target,
      title: config.mediafiles,
      width: "50%",
      height: "70%",
      html: template,
      callback: (options) => {
        setTimeout(() => {
          let file = document.querySelector("#file");
          let info = document.querySelector("#info");
          let imagesContainer = document.querySelector("#images");

          loadImageFiles(imagesContainer);

          file.addEventListener("change", (evt) =>
            saveImageFile(evt, info, imagesContainer)
          );
        }, 200);
      },
    });
}