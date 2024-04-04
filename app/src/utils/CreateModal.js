import isMobile from "./IsMobile";

/**
 * Create a new modal with the given arguments.
 *
 * @param {Object} args - An object containing the configuration for the new modal
 * @return {Object} The newly created modal
 */
export default function CreateNewModal(args) {
  let opts = {
    title: args.title,
    x: "right",
    y: "bottom",
    width: isMobile ? "100%" : args.width,
    height: isMobile ? "100%" : args.height,
    autosize: isMobile ? true : false,
    modal: isMobile ? true : false,
    html: args.html,
    oncreate: args.callback,
    onclose: () => {
      if (args.target) {
        args.target.disabled = false;
        args.target.classList.remove("active");
      }
    },
  };
  return WinBox.new(opts);
}
