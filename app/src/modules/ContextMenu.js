import CreateElement from "../utils/CreateElement";
import {editor} from "../modules/Vars";

const contextOptionsMenu = [
  { name: "Boxes",handler: () => editor.wrap('[Boxes]', "[/Boxes]")},
  { name: "Box",handler: () => editor.wrap('[Box num=4]', "[/Box]")},
  { name: "Details",handler: () => editor.wrap('[Details name="More info" open]', "[/Details]")},
  { name: "Color", handler: () => editor.wrap('[Color name=""]', "[/Color]") },
  { name: "Justify", handler: () => editor.wrap("[Justify]", "[/Justify]") },
  { name: "Center", handler: () => editor.wrap("[Center]", "[/Center]") },
  { name: "Right", handler: () => editor.wrap("[Right]", "[/Right]") },
  { name: "Divider", handler: () => editor.insert("[Divider]") },
  { name: "Note", handler: () => editor.wrap('[Note name=""]', "[/Note]") },
  { name: "Columns",handler: () => editor.wrap("[Columns num=2]", "[/Columns]")},
  { name: "Grid",handler: () => editor.insert("[Grid]\n[Img src=\"https://i.ibb.co/D8TSt0T/atle-mo-h-KWXt-AXe-Xco-unsplash.jpg\"]\n[Img src=\"https://i.ibb.co/NmdC1J3/alessandro-viaro-fw-Wj5-Y1-Ig-Qg-unsplash.jpg\"]\n[/Grid]")},
  { name: "Img",handler: () => editor.insert('[Img src="https://i.ibb.co/NmdC1J3/alessandro-viaro-fw-Wj5-Y1-Ig-Qg-unsplash.jpg"]')},
  { name: "Comment", handler: () => editor.wrap("[Comment]This is a comment", "[/Comment]") },
  { name: "Header", handler: () => editor.insert("# Header") },
  { name: "Tasks", handler: () => editor.insert("- [ ] One\n- [x] Two") },
  { name: "Table", handler: () => editor.insert("| **lorem** | **ipsum**    | **dolor** | **sit**|\n|-----------|-------------|------------|---------|\n| 1         | 2           | 3          | 4       |\n| 5         | 6           | 7          | 8       |\n| 9         | 10          | 11         | 12      |") },
  { name: "Lorem", handler: () => editor.insert("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.") },
  { name: "Youtube", handler: () => editor.insert('[Youtube id="JU6sl_yyZqs" width="100%" height="100%"]') },
  { name: "Archive", handler: () => editor.insert('[Archive id="fansub_Chobits" width="100%" height="100%"]') },
  { name: "Dtube", handler: () => editor.insert('[Dtube id="ve2Uf3nLF9I" width="100%" height="100%"]') },
  { name: "Dailymotion", handler: () => editor.insert('[Dailymotion id="x8opk11"]') },
]

// Create a div element called menu and add it to the body of the document.
export const menu = CreateElement({
  element: "div",
  where: document.body,
  args: {
    id: "context-menu",
    className: "context-menu",
    onclick: (e) => e.preventDefault(),
  },
});

// Create a div element called menuHeader and add it to the menu.
const menuHeader = CreateElement({
  element: "div",
  where: menu,
  args: {
    className: "context-menu-header",
    textContent: "Menu",
  },
});

// Create a div element called menuBody and add it to the menu.
const menuBody = CreateElement({
  element: "div",
  where: menu,
  args: {
    className: "context-menu-body",
  },
});

// Iterate over the array of options and create a button for each of them.
contextOptionsMenu.forEach((options) =>
  CreateElement({
    element: "button",
    where: menuBody,
    args: {
      className: "button",
      type: "button",
      textContent: options.name,
      onclick: (evt) => {
        evt.preventDefault();
        options.handler();
        menu.style.display = "none"
      },
    },
  })
);