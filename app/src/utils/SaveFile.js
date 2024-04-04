import { HtmlTemplate } from "../modules/Templates";
import Storage from "./Storage";
import Minify from "./Minify.js";

/**
 * Saves the file by creating a themed HTML template from the content of the main element in the window frame, and then downloads it as a file.
 *
 * @param {}
 * @return {}
 */
const saveFile = () => {
  const body = window.frames[0].document.querySelector("main");

  // Add theme
  let dataTheme = "";
  dataTheme = getDataTheme(dataTheme);

  let customCss = Storage("Markdroids-custom-css") || "";
  let outputCss = Minify(customCss);

  // Template
  const template = HtmlTemplate(dataTheme, body.innerHTML, outputCss);

  // Blob
  const blob = new Blob([template], {
    type: "text/html",
  });

  // Create link
  downloadFile(blob);
};

export default saveFile;

/**
 * Function to set the data theme based on storage value.
 *
 * @param {string} dataTheme - the current data theme
 * @return {string} the updated data theme
 */
function getDataTheme(dataTheme) {
  let body = window.frames[0].document.body;
  if (Storage("Markdroids-data-theme") === "dark") {
    dataTheme = 'data-theme="dark"';
    body.setAttribute("data-theme", "dark");
  } else {
    dataTheme = 'data-theme="light"';
    body.setAttribute("data-theme", "light");
  }
  return dataTheme;
}

/**
 * Function to download a file using the provided blob.
 *
 * @param {Blob} blob - The blob data to be downloaded
 * @return {void} This function does not return anything
 */
function downloadFile(blob) {
  const anchor = document.createElement("a");
  // Download file
  anchor.download = "markdroids-file.html";
  anchor.href = window.URL.createObjectURL(blob);
  anchor.dataset.downloadurl = ["text/html", anchor.download, anchor.href].join(":");

  // Trigger click event and handle any potential errors
  try {
    anchor.click();
  } catch (error) {
    console.error("Error occurred while triggering download:", error);
  }
}