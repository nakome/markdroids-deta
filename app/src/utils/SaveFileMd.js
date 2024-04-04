/**
 * Saves the content of the editor as a markdown file.
 *
 * @param {object} editor - the editor object containing the content to be saved
 * @return {void}
 */
const saveFileMd = (editor) => {
  const blob = new Blob([editor.value], {
    type: 'text/markdown',
  });

  const anchor = document.createElement('a');
  // download file
  anchor.download = 'markdroids-file.md';
  anchor.href = (window.URL || window.webkitURL).createObjectURL(blob);
  anchor.dataset.downloadurl = `text/markdown:${anchor.download}:${anchor.href}`;
  anchor.dispatchEvent(new MouseEvent('click'));
};

export default saveFileMd;