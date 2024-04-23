import Editor from "./Editor";

export const btnSaveFile = document.getElementById("btnSaveFile");
export const btnSaveHtml = document.getElementById("btnSaveHtml");
export const btnSaveMd = document.getElementById("btnSaveMd");
export const btnHelp = document.getElementById("btnHelp");
export const btnDarkMode = document.getElementById("btnDarkMode");
export const btnPrint = document.getElementById("btnPrint");
export const btnDrive = document.getElementById("btnDrive");
export const btnSettings = document.getElementById("btnSettings");
export const renderBtn = document.getElementById("renderBtn");
export const readFileBtn = document.getElementById("openFile");
export const eyeBtn = document.getElementById("eyeBtn");
export const editorArea = document.getElementById("editorArea");
export const iFramePreview = document.getElementById("iFrameContent");
export const btnHtmlOutput = document.getElementById("btnHtmlOutput");
export const btnImages = document.getElementById("btnImages");
export const iFrame = iFramePreview.contentWindow;
export const dropdown = document.getElementById("dropdown");
export const editor = new Editor(editorArea);

