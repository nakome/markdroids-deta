
/**
 * Creates a button element and appends it to the parent element.
 *
 * @param {Element} parent - The parent element to which the button will be appended
 * @param {string} innerHTML - The HTML content of the button
 * @param {string} title - The title attribute of the button
 * @param {function} onclick - The function to be executed when the button is clicked
 * @return {HTMLButtonElement} The newly created button element
 */
const createButton = (parent, innerHTML, title, onclick) => {
    const button = document.createElement("button");
    button.className = "button";
    button.innerHTML = innerHTML;
    button.type = "button";
    button.title = title;
    button.onclick = onclick;
    parent.appendChild(button);
    return button;
  };

export default createButton;