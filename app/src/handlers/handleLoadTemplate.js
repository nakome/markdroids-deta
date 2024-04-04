import {editor} from "../modules/Vars.js";

export default async function handleLoadTemplate(savedMd) {
    // Checks for stored data,
// if it does not load the default template
if (typeof savedMd === "undefined") {
    let url = "/api/md/default-template.md";
    fetch(url)
      .then((r) => r.text())
      .then((r) => {
        editor.insert(r);
      })
      .catch((error) => {
        console.error("Error getting the default template:", error);
        // Handle the error appropriately, such as displaying an error message in the editor.
      });
  } else {
    editor.insert(savedMd);
  }
}