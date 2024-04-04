import TransformMD from "../modules/TransformMd.js";
import { editorArea, iFrame } from "../modules/Vars.js";

/**
 * Render the content based on the event passed.
 *
 * @param {type} evt - the event triggering the content rendering
 * @return {type} undefined
 */
export default function renderContent(evt) {
    evt.preventDefault();
    TransformMD(editorArea, iFrame);
}