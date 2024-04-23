import Split from "split.js";

import "./utils/winbox.bundle.min.js";
import Storage from "./utils/Storage.js";
import IsMobile from "./utils/IsMobile.js";
import { saveBinSettings } from "./utils/DriveFiles";
import DeleteCacheFromNewVersion from "./utils/DeleteCacheFromNewVersion.js";

import {
  btnSaveFile,
  btnSaveHtml,
  btnHelp,
  btnDarkMode,
  btnPrint,
  btnSaveMd,
  btnDrive,
  btnImages,
  btnSettings,
  renderBtn,
  readFileBtn,
  eyeBtn,
  editorArea,
  iFramePreview,
  dropdown,
  editor,
} from "./modules/Vars.js";

import renderShortCodes from "./modules/ShortCodes.js";

import config from "./config/lang.json";
import customCss from "./styles/default.css?raw";

import handleRenderContent from "./handlers/handleRenderContent.js";
import handleRenderFile from "./handlers/handleRenderFile.js";
import handleSaveDriveFile from "./handlers/handleSaveDriveFile.js";
import handleGetImages from "./handlers/handleGetImages.js";
import handleSaveMd from "./handlers/handleSaveMd.js";
import handleSaveFile from "./handlers/handleSaveFile.js";
import handleViewHtmlOutput from "./handlers/handleViewHtmlOutput.js";
import handleViewHelp from "./handlers/handleViewHelp.js";
import handleToggleTheme from "./handlers/handleToggleTheme.js";
import handleViewDriveFiles from "./handlers/handleViewDriveFiles.js";
import handleSettings from "./handlers/handleSettings.js";
import handleWatchKeys from "./handlers/handleWatchKeys.js";
import { handleToggleContextMenu, handleContextMenu } from "./handlers/handleContextMenu.js";
import handleViewPreview from "./handlers/handleViewPreview.js";
import handleLoadTemplate from "./handlers/handleLoadTemplate.js";
import handleToggleMenu from "./handlers/handleToggleMenu.js";

console.log('🚀 All is ok');

// Insert in localStorage
const savedMd = Storage("Markdroids-saved");
const themeColor = Storage("Markdroids-data-theme") || "light";
const style = Storage("Markdroids-custom-style") || customCss;

// Save the global settings
const defaultSettings = { style: style, theme: themeColor };

saveBinSettings(defaultSettings);

handleLoadTemplate(savedMd);

renderShortCodes();

// Check if it is a mobile device
if (IsMobile) {

  editorArea.classList.add("isMobile");
  iFramePreview.classList.add("isMobile");

  // Hide buttons if mobile version or vice versa
  renderBtn.style.display = "none";
  readFileBtn.style.display = "none";

} else {

  // Hide buttons if mobile version or vice versa
  eyeBtn.style.display = "none";

  // Split the editor area and iFrame content into two panes
  Split(["#editorArea", "#iFrameContent"], {
    sizes: [40, 60],
    minSize: 1,
    gutterSize: 7,
  });
}

// Check theme
if (themeColor === "dark") {
  btnDarkMode.querySelector("img").src = "./api/icons/svg/dark-mode.svg";
} else {
  btnDarkMode.querySelector("img").src = "./api/icons/svg/light-mode.svg";
}



// Clear the cache of old applications
DeleteCacheFromNewVersion("Markdroids-version", config.version);

// Insert the color theme
document.body.dataset.theme = themeColor;
window.frames[0].document.body.dataset.theme = themeColor;

// Assign event handlers
renderBtn.addEventListener("click", handleRenderContent);
// Transform Markdown
readFileBtn.addEventListener("change", handleRenderFile);
// Save in Drive
btnSaveFile.addEventListener("click", handleSaveDriveFile);
// Media manager
btnImages.addEventListener("click", handleGetImages);
// Save to Markdown file
btnSaveMd.addEventListener("click", handleSaveMd);
// Save to Html file
btnSaveHtml.addEventListener("click", handleSaveFile);
// See html output
btnHtmlOutput.addEventListener("click", handleViewHtmlOutput);
// Upload help
btnHelp.addEventListener("click", handleViewHelp);
// Switch to dark mode
btnDarkMode.addEventListener("click", handleToggleTheme);
// Print
btnPrint.addEventListener("click", () => window.frames[0].print());
// View list of drive files
btnDrive.addEventListener("click", handleViewDriveFiles);
// Open settings
btnSettings.addEventListener("click", handleSettings);
// Prior view
eyeBtn.addEventListener("click", handleViewPreview);
// Listening to keys
editor.area.addEventListener("keydown", handleWatchKeys);
// Contextual menu
editor.area.addEventListener("contextmenu", handleContextMenu);
// Event to hide the context menu when clicking in the editor area
editor.area.addEventListener("click", handleToggleContextMenu);
dropdown.querySelector('button').addEventListener("click", handleToggleMenu);
