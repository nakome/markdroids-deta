import Express from "express";
import { use } from "marked";

import useCors from "./endpoints/useCors.js";
import getKeyRoute from "./endpoints/getKeyRoute.js";
import getJsonPhotos from "./endpoints/getJsonPhotos.js";
import getJsonAll from "./endpoints/getJsonAll.js";
import getJsonKey from "./endpoints/getJsonKey.js";
import getJsonPhotosByName from "./endpoints/getJsonPhotoByName.js";

const app = Express();

use({
  pedantic: false,
  gfm: true,
  breaks: false,
  smartLists: false,
});

// Task list
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

use({ renderer });

app.use(useCors);

app.get("/:key", getKeyRoute);
app.get("/json/photos", getJsonPhotos);
app.get("/json/all", getJsonAll);
app.get("/json/:key", getJsonKey);
app.get("/json/photos/:name", getJsonPhotosByName);

export default app;
