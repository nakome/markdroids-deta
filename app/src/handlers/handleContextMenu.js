import { menu } from "../modules/ContextMenu.js";

/**
 * Handles the context menu event.
 *
 * @param {Event} evt - The event triggering the context menu
 * @return {boolean} Whether the default behavior should be prevented
 */
export function handleContextMenu(evt) {

    evt.preventDefault();
    evt.stopPropagation();

    // Show context menu
    menu.style.left = `${evt.clientX}px`;
    menu.style.top = `${evt.clientY}px`;
    menu.style.display = "block";

    // Prevent default
    return false;
}

/**
 * Handles the toggle of the context menu by preventing the default event and hiding the menu.
 *
 * @param {type} evt - the event triggering the function
 * @return {type} undefined - no return value
 */
export function handleToggleContextMenu(evt) {
    evt.preventDefault();
    menu.style.display = "none";
}