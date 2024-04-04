import TransformMD from "../modules/TransformMd.js";
import {
    eyeBtn,
    editorArea,
    iFramePreview,
    iFrame
} from "../modules/Vars.js";


/**
 * Function to handle toggling between editor and preview modes.
 *
 * @param {Event} evt - The event triggering the function
 */
export default function handleViewPreview(evt) {

    editorArea.classList.toggle("hide");
    iFramePreview.classList.toggle("show");

    const iconSrc = editorArea.classList.contains("hide")
        ? `./api/icons/svg/eye-slash.svg`
        : `./api/icons/svg/eye.svg`;

    eyeBtn.innerHTML = `<img alt="Eye icon" src="${iconSrc}"/>`;

    TransformMD(editorArea, iFrame);
}