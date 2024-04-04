/**
 * Create a new element and append it to a specified location in the DOM.
 *
 * @param {object} options - An object containing the element to create, where to append it, and optional attributes.
 * @return {Element} The newly created element.
 */
export default function createElement({ element, where, args }) {
  let tagEl = document.createElement(element);
  if (args) {
    for (const key in args) {
      let k = key;
      tagEl[k] = args[key];
    }
  }
  try {
    where.appendChild(tagEl);
    return tagEl;
  } catch (error) {
    console.log(error.message);
  }
}