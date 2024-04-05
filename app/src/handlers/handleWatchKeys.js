import PrintFrame from "../utils/PrintFrame.js";
import TransformMD from "../modules/TransformMd.js";
import {iFrame,editorArea} from "../modules/Vars.js";
/**
 * Handle different key events and perform corresponding actions.
 *
 * @param {Event} evt - The key event object
 * @return {boolean} Whether the event was handled successfully
 */
export default function handleWatchKeys(evt) {
  // 2 spaces when pressing Tab with the Shift key
  if (evt.shiftKey && evt.keyCode === 9) {
    editor.outdent("  ");
    return false;
  }
  // Add 2 spaces when pressing Tab key
  if (evt.keyCode === 9) {
    editor.indent("  ");
    return false;
  }
  // Ctrl + Enter
  if (evt.ctrlKey && evt.keyCode === 13) {
    TransformMD(editorArea, iFrame);
  }
  // Ctrl + p
  if (evt.ctrlKey && evt.keyCode === 80) {
    PrintFrame();
  }
}