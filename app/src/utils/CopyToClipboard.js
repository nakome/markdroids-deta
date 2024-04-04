
/**
 * Copy text content of an element to the clipboard when a button is clicked.
 *
 * @param {Event} evt - The event that triggers the copy action
 * @param {Element} element - The element whose text content will be copied
 * @param {Element} button - The button element responsible for triggering the copy action
 * @return {boolean} Indicates if the copy action was successful
 */
export default function CopyToClipboard(evt, element, button) {
  evt.preventDefault();
  navigator.clipboard
    .writeText(element.textContent)
    .then(() => {
      button.textContent = "🍻 Copied!";
      setTimeout(() => {
        button.textContent = "🍺 Copy Code";
      }, 1000);
    })
    .catch((err) => {
      console.error("Error copying code: ", err);
    });
  return false;
}
