import ShortCode from "../utils/ShortCodeParser";
import { encodeUnicode } from "../utils/Base64.js";
import Storage from "../utils/Storage";
import { use, parse } from "marked";
import renderShortCodes from "./ShortCodes.js";

use({
  pedantic: false,
  gfm: true,
  breaks: false,
  smartLists: false,
});

// convert tasks with checkbox
const renderer = {
  listitem(text, task) {
    if (task) {
      return `<li class="task"><label>${text.replace(
        /^<li>([\s\S]*)<\/li>\n$/,
        "$1"
      )}</label></li>`;
    } else {
      return `<li>${text}</li>`;
    }
  },
};

// use tasks
use({ renderer });

/**
 * Transform markdown and send to iframe
 */
export default async function TransformMD(state, outPoutEl) {

  renderShortCodes();

  // iframe main content
  let main = outPoutEl.document.querySelector("main");

  // clear the main iframe content
  main.innerHTML = "";

  // save the value of the editor in localStorage
  Storage("Markdroids-saved", state.value);

  // Parse ShortCodes
  const parseContent = ShortCode.parse(state.value),
  content = parse(parseContent);

  // send to iframe
  outPoutEl.postMessage(
    JSON.stringify({
      body: {
        css: encodeUnicode(Storage("Markdroids-custom-css")),
        content: encodeUnicode(content),
      },
    }),
    "*"
  );
  return state
}

export async function TransformMDToHtml(state) {
  renderShortCodes();
  // Parse shortCodes
  const parseContent = ShortCode.parse(state.value),
  content = parse(parseContent);
  return content;
}
