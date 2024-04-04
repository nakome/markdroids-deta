/**
 * Retrieves a template file based on the given name and populates the editor with the content.
 *
 * @param {string} name - The name of the template file to retrieve.
 * @param {Editor} editor - The editor where the template content will be populated.
 */
const getTemplate = async (name, editor) => {
  let url = `./public/${name}.md`;
  try {
    let response = await fetch(url);
    let output = await response.text();
    editor.value = output;
  } catch (error) {
    console.log(error.message);
  }
};

export default getTemplate;