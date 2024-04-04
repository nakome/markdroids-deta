import TransformMD from "../modules/TransformMd.js";
import ReadFile from "../utils/ReadFile.js";
import { editorArea, iFrame } from "../modules/Vars.js";

/**
 * Asynchronously handles rendering a file.
 *
 * @param {Event} evt - The event triggering the function.
 * @return {Promise} A promise that resolves when rendering is complete.
 */
export default async function handleRenderFile(evt) {
    const response = await ReadFile(evt.target.files[0]);
    editorArea.value = response;
    TransformMD(editorArea, iFrame);
}