/**
 * Typing function to simulate typing effect
 *
 * @param {HTMLElement} elem - the element to type into
 * @param {string} txt - the text to type
 * @return {void}
 */
export default function Typing(elem, txt) {
  let num = 0;
  let s = setInterval(() => {
    elem.value += txt[num++];
    if (num === txt.length) {
      clearInterval(s);
    }
  }, 10);
}
