import ShortCode from "./ShortCodeParser.js";
import { parse } from "marked";

/**
 * Parse the short codes in the output text.
 * @param {string} output - The output text.
 * @returns {string} - The output text with the analysed short codes.
 */
export const parseShortCodes = (output) => ShortCode.parse(output);

/**
 * Parses the shortcodes in the output text and converts it to Markdown.
 * @param {string} output - The output text.
 * @returns {string} - The output text converted to Markdown.
 */
export const parseShortCodesOutput = (output) => {
  try {
    const parseShortcode = parseShortCodes(output);
    const toMd = parse(parseShortcode);
    return toMd;
  } catch (error) {
    // Handling any errors that may occur during analysis or conversion
    console.error("An error occurred while parsing or converting the text:", error);
    return null;
  }
};