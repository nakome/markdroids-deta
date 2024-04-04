import { Base, Drive } from "deta";
import { editorArea, editor, iFrame } from "../modules/Vars";
import TransformMD from "../modules/TransformMd";
import { encodeUnicode, decodeUnicode, isBase64 } from "../utils/Base64";
import Store from "./Store";
import Toast from "./Toast";

// Constants
const CLOUDFILES = Drive("cloud");
const CLOUDIMAGES = Drive("images");
const CLOUDDB = Base("bin");
const CLOUDDBSETTINGS = Base("settings");

/**
 * Asynchronously fetches drive files and handles the response or error.
 *
 * @param {type} val - description of parameter
 * @return {type} description of return value
 */
export async function fetchDriveFiles(val) {
  try {
    const response = await CLOUDDB.fetch();
    return renderFetch(response);
  } catch (error) {
    console.error("Error fetching drive files:", error);
    return "Error fetching drive files.";
  }
}

/**
 * Loads a drive file and adds event listeners to the elements with the "card-load-btn" class.
 *
 * @param {Event} evt - The event that triggers the file loading
 * @param {Window} win - The window where the file is loaded
 * @return {Promise} A Promise that resolves when the file is successfully loaded
 */
export async function loadDriveFile(evt, win) {
  const dataLoad = document.getElementsByClassName("card-load-btn");

  const filenames = Array.from(dataLoad).map(
    (item) => `${item.dataset.key}.${item.dataset.type}`
  );

  for (let i = 0; i < dataLoad.length; i++) {

    const item = dataLoad[i];

    item.addEventListener("click", async (evt) => {
      try {

        // Delete all active classes
        Array.from(dataLoad).forEach((item) => {
          item.parentElement.parentElement.classList.remove('active-card');
          item.previousElementSibling.classList.remove("active")
        });

        const response = await CLOUDFILES.get(filenames[i]);

        Store.set({ key: evt.target.dataset.key });

        // Read file
        readTheFile(evt, response);

        /mobile/i.test(navigator.userAgent) && win.close();
      } catch (error) {
        console.error("Error al obtener el archivo:", error);
        errorMsg(`Error getting file ${filenames[i]}`);
      }
    });
  }
}

/**
 * Function to delete a drive file when the corresponding delete button is clicked.
 *
 * @param {none} - No parameters
 * @return {void} - No return value
 */
export function deleteDriveFile() {
  const deleteButtons = document.querySelectorAll(".card-delete-btn");

  for (let i = 0; i < deleteButtons.length; i++) {
    const item = deleteButtons[i];
    item.addEventListener("click", async () => {
      try {
        if (confirm("Are you sure to delete file?")) {
          const filename = `${item.dataset.key}.${item.dataset.type}`;
          const responseDb = await CLOUDDB.delete(item.dataset.key);
          const responseDelete = await CLOUDFILES.delete(filename);

          if (responseDelete === filename) {
            item.parentElement.parentElement.remove();
            successMsg(
              `${filename} is removed`,
              async (toast) => await fetchDriveFiles()
            );
          }
        }
      } catch (error) {
        console.error("Error deleting the file:", error);
        const errorMsgText = `Error deleting file ${filename}`;
        errorMsg(errorMsgText);
      }
    });
  }
}

/**
 * Saves the drive file after prompting for a revision name. It then inserts the file into the cloud database and updates the cloud file with the content of the editor area. 
 *
 * @param {Element} editorArea - The editor area element where the file content is located
 * @return {Promise<void>} A promise that resolves after the file is saved
 */
export async function saveDriveFile(editorArea) {
  try {
    const revisionName = prompt("Revision name");

    if (revisionName) {
      const currentDate = new Date();
      const updateDate = currentDate.toLocaleDateString();
      const updateTime = currentDate.toLocaleTimeString();

      const outputDb = await CLOUDDB.insert({
        name: `${revisionName}`,
        type: "md",
        update: `${updateDate} ${updateTime}`,
        public: false,
      });

      if (outputDb.key) {
        const text = editorArea.value;
        const outputFile = await CLOUDFILES.put(`${outputDb.key}.md`, {
          data: encodeUnicode(text),
          contentType: "text/plain;charset=utf-8",
        });

        successMsg(
          `${revisionName} has been saved`,
          async (toast) => await fetchDriveFiles()
        );
      } else {
        errorMsg(`Sorry, the file ${revisionName} is not saved`);
      }
    }
  } catch (error) {
    console.error("Error saving the file:", error);
    errorMsg("An error occurred while saving the file");
  }
}

/**
 * Toggle the public drive file setting when a switch is changed.
 *
 * @param {Event} evt - The event that triggered the function
 * @return {void}
 */
export function togglePublicDriveFile() {
  const switches = document.querySelectorAll(".switch-public");

  for (let i = 0; i < switches.length; i++) {
    const switchBtn = switches[i];

    switchBtn.addEventListener("change", async (evt) => {
      try {
        const key = evt.target.dataset.key;
        const name = evt.target.dataset.name;
        const type = evt.target.dataset.type;
        const update = evt.target.dataset.update;
        const value = evt.target.checked;

        const outputDb = await CLOUDDB.put({
          key: key,
          name: name,
          update: update,
          type: type,
          public: value,
        });

        const encodeBase64 = encodeUnicode(
          JSON.stringify({ key: key, update: update })
        );

        const fileLink = outputDb.public
          ? `<a class="flash-one-time" href="./api/${encodeBase64}" target="_blank" rel="noopener" title="Share ${name}">${name}</a> - <small>${update}</small>`
          : `${name} - <small>${update}</small>`;

        const parentElement =
          switchBtn.parentElement.parentElement.parentElement;
        const desiredElement = parentElement.querySelector("h3");
        desiredElement.innerHTML = fileLink;
      } catch (error) {
        console.error("Error changing the publication setting:", error);
        errorMsg("An error occurred while changing the publication setting");
      }
    });
  }
}

/**
 * Update a drive file when a specific button is clicked.
 *
 * @param {Event} evt - The event object triggered by the click
 * @return {Promise} A promise that resolves after the file is updated
 */
export function updateDriveFile() {
  const updateButtons = document.querySelectorAll(".card-update-btn");

  updateButtons.forEach((updateBtn) => {
    updateBtn.addEventListener("click", async (evt) => {
      try {
        updateBtn.classList.add("flash-one-time");

        const currentDate = new Date();
        const updateDate = currentDate.toLocaleDateString();
        const updateTime = currentDate.toLocaleTimeString();
        const name = evt.target.dataset.name;

        const outputDb = await CLOUDDB.put({
          key: evt.target.dataset.key,
          name: name,
          update: `${updateDate} ${updateTime}`,
          type: evt.target.dataset.type,
          public: evt.target.dataset.public,
        });

        if (outputDb.key) {
          const text = editorArea.value;

          await CLOUDFILES.put(`${outputDb.key}.md`, {
            data: encodeUnicode(text),
            contentType: "text/plain;charset=utf-8",
          });

          successMsg(`${name} is updated`, async () => {
            updateBtn.classList.remove("flash-one-time");
            await fetchDriveFiles();
          });
        }
      } catch (error) {
        console.error("Error updating the file:", error);
        errorMsg("An error occurred while updating the file");
      }
    });
  });
}

/**
 * Saves the bin settings to the cloud database.
 *
 * @param {Object} data - The data object containing style and theme information
 * @return {Promise} A Promise that resolves when the settings are saved successfully
 */
export async function saveBinSettings(data) {
  try {
    const key = "settingskeydefault";
    const opts = {
      key: key,
      data: data.style,
      theme: data.theme,
    };
    const bin = await CLOUDDBSETTINGS.get(key);
    if (bin !== null) {
      await CLOUDDBSETTINGS.put(opts);
    } else {
      await CLOUDDBSETTINGS.insert(opts);
    }
  } catch (error) {
    console.error("Error al guardar la configuración del bin:", error);
    errorMsg("An error occurred while saving the bin settings");
  }
}

/**
 * Loads image files from an API and dynamically creates HTML elements to display them.
 *
 * @param {HTMLElement} imagesContainer - The container where the images will be displayed.
 * @return {Promise} A promise that resolves when all images are loaded and displayed.
 */
export async function loadImageFiles(imagesContainer) {
  try {
    // Se hace una petición a una API que devuelve un objeto JSON con los datos de las imágenes.
    let response = await fetch("/api/json/photos");
    let output = await response.json();

    if (output.status === 200) {
      if (output.data.length > 0) {
        imagesContainer.innerHTML = "";

        // Se recorre el array de objetos y se crea un elemento HTML con los datos de cada imagen.
        output.data.map((item, index) => {
          imagesContainer.innerHTML += `<div class="card-image">
            <button id="insertImageBtn_${index}" data-name="${item.name}" data-url="${location.origin}${item.url}">
              <img src="api/icons/svg/copy.svg"/>
            </button>
            <button id="deleteImageBtn_${index}" data-name="${item.name}">
              <img src="api/icons/svg/trash.svg"/>
            </button>
            <img src="${location.origin}${item.url}" alt="${item.name}"/>
          </div>`;

          // Se agrega un listener a los botones de insertar y eliminar imágenes.
          let w = setTimeout(() => {
            let insertImageBtn = document.getElementById(
              `insertImageBtn_${index}`
            );
            let deleteImageBtn = document.getElementById(
              `deleteImageBtn_${index}`
            );

            insertImageBtn.addEventListener("click", (evt) => {
              // Se inserta el código HTML de la imagen en el editor de texto.
              editor.insert(
                `[Img href="${evt.target.dataset.url}" src="${evt.target.dataset.url}"]`
              );
            });

            deleteImageBtn.addEventListener("click", async (evt) => {
              // Se elimina la imagen de la API y se remueve el elemento HTML del DOM.
              let filename = evt.target.dataset.name;
              let responseDelete = await CLOUDIMAGES.delete(
                evt.target.dataset.name
              );
              if (responseDelete === filename) {
                evt.target.parentElement.remove();
              }
            });

            clearTimeout(w);
          }, 800);
        });
      } else {
        console.log("Empty drive files");
        imagesContainer.innerHTML = "<small>Empty drive files..</small>";
      }
    }
  } catch (error) {
    console.error("Error al cargar las imágenes:", error);
    errorMsg("An error occurred while loading the images");
  }
}

/**
 * Save an image file after validating its type and size, then upload it to a cloud service.
 *
 * @param {Event} evt - The event triggering the function
 * @param {HTMLElement} info - The HTML element to display information
 * @param {HTMLElement} imagesContainer - The container for displaying uploaded images
 * @return {Promise} A Promise that resolves after the image is successfully uploaded
 */
export async function saveImageFile(evt, info, imagesContainer) {
  let file = evt.target.files[0];
  let maxFileSize = 3 * 1024 * 1024; // 3 MB
  let validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];

  // Check type
  if (!validTypes.includes(file.type)) {
    evt.target.value = "";
    let msg = `Invalid file type: ${file.type}. Please upload a valid image file.`;
    errorMsg(msg);
    return;
  }

  // Check size
  if (file.size > maxFileSize) {
    evt.target.value = "";
    let msg = `The file ${file.name} exceeds the maximum size of 3 MB.`;
    errorMsg(msg);
    return;
  }

  // Write message when upload
  info.innerHTML = "Uploading file, please wait...";

  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const outputFile = await CLOUDIMAGES.put(file.name, {
      data: new Uint8Array(arrayBuffer),
      contentType: file.type,
    });

    evt.target.value = "";
    successMsg(
      `Image uploaded successfully: ${outputFile}`,
      () => (info.innerHTML = "")
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Upload file
    info.innerHTML = "Please upload an image with a size less than 2MB.";

    await loadImageFiles(imagesContainer);
  } catch (error) {
    evt.target.value = "";
    errorMsg(`Error uploading image: ${error}`);
    console.error(msg);
  }
}

/**
 * Generate HTML for rendering fetched response items.
 *
 * @param {object} response - the response object containing items and count
 * @return {string} the HTML generated from the response items
 */
function renderFetch(response) {
  if (response.items && response.count > 0) {
    let html = ``;

    response.items.forEach((item) => {
      // Encode key and update data
      const encodeBase64 = encodeUnicode(
        JSON.stringify({ key: item.key, update: item.update })
      );

      // Check if is public
      const fileLink = item.public
        ? `<a class="flash-one-time" href="./api/${encodeBase64}" target="_blank" rel="noopener" title="Share ${item.name}">${item.name}</a> - <small>${item.update}</small>`
        : `${item.name} - <small>${item.update}</small>`;

      const uid = Store.get();
      // Render template
      html += `
        <div class="card  ${uid.key === item.key ? "active-card" : ""}">
          <h3>${fileLink}</h3>
          <div class="card-btn-group">
            <label class="switch" for="${item.key}">
              <input
                class="switch-public"
                name="switchElement"
                id="${item.key}"
                data-update="${item.update}"
                data-name="${item.name}"
                data-key="${item.key}"
                data-type="${item.type}"
                title="Share file"
                type="checkbox"
                ${item.public ? "checked" : ""}
              />
            </label>
            <button
              class="card-update-btn ${uid.key === item.key ? "active" : ""}"
              data-key="${item.key}"
              data-type="${item.type}"
              data-public="${item.public}"
              data-name="${item.name}"
              data-update="${item.update}"
              data-action="update"
              title="Update file"
            >
              <img alt="Update Markdown icon" src="./api/icons/svg/floppy.svg"/>
            </button>
            <button
              class="card-load-btn"
              data-key="${item.key}"
              data-type="${item.type}"
              data-action="load"
              title="Load file"
            >
              <img alt="Save Markdown icon" src="./api/icons/svg/load.svg"/>
            </button>
            <button
              class="card-delete-btn"
              data-key="${item.key}"
              data-type="${item.type}"
              data-action="delete"
              title="Delete file"
            >
              <img alt="Save Markdown icon" src="./api/icons/svg/trash.svg"/>
            </button>
          </div>
        </div>`;
    });

    return html;
  } else {
    return "Empty drive files.";
  }
}

/**
 * Reads the contents of a file as an array buffer.
 *
 * @param {File} file - The file to read as an array buffer
 * @return {Promise} A promise that resolves with the array buffer data or rejects with an error
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("The file is invalid"));
      return;
    }

    if (!(file instanceof File)) {
      reject(new Error("An object of type File was expected"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read the contents of a file, update the editor, transform markdown, and add active classes.
 *
 * @param {Event} evt - The event triggering the file read
 * @param {any} response - The response containing the file data
 */
function readTheFile(evt, response) {
  const reader = new FileReader();
  reader.onload = () => {
    editorArea.value = isBase64(reader.result)
      ? reader.result
      : decodeUnicode(reader.result);
    TransformMD(editorArea, iFrame);
    // Add class active
    evt.target.parentElement.parentElement.classList.add('active-card');
    evt.target.previousElementSibling.classList.add("active");
  };
  reader.onerror = (error) => {
    console.error("Error al leer el archivo:", error);
    errorMsg(`Error reading file: ${error}`);
  };
  reader.readAsText(response, "UTF-8");
}

/**
 * Generates a success message toast with the provided content and callback.
 *
 * @param {string} content - The content of the success message.
 * @param {function} callback - The callback function to execute on toast close.
 * @return {object} The result of pushing the success toast.
 */
function successMsg(content, callback) {
  return Toast.push({
    title: "👩‍💻 Info",
    content: content,
    style: "success",
    dismissAfter: "1s",
    onclose: () => callback || {},
  });
}

/**
 * A function that displays an error message using Toast.
 *
 * @param {string} content - The content of the error message.
 * @return {object} The result of pushing the error message to Toast.
 */
function errorMsg(content) {
  return Toast.push({
    title: "😢 Error",
    content: content,
    style: "error",
    dismissAfter: "1s",
  });
}
