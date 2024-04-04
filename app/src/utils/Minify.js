/**
 * Minifies the input string by removing unnecessary whitespace, comments, and semicolons.
 *
 * @param {string} str - the input string to be minified
 * @return {string} the minified string
 */
export default function Minify(str) {
    str = str.replace(/([^0-9a-zA-Z\.#])\s+/g, "$1");
    str = str.replace(/\s([^0-9a-zA-Z\.#]+)/g, "$1");
    str = str.replace(/;}/g, "}");
    str = str.replace(/\/\*.*?\*\//g, "");
    return str;
}