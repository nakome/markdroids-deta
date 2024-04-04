import { Deta } from "deta";
import {renderError} from "../../modules/error.js";
import renderShortCodes from "../../modules/ShortCodes.js";
import decodeJsonKey from "../../modules/decodeJsonKey.js";
import fileToBuffer from "../../modules/fileToBuffer.js";
import checkIsBase64 from "../../modules/checkIsBase64.js";
import {parseShortCodesOutput} from "../../modules/parseShortCodes.js";

const deta = Deta();
const CLOUDFILES = deta.Drive("cloud");
const CLOUDDB = deta.Base("bin");
const CLOUDDBSETTINGS = deta.Base("settings");

/**
 * Generate the key route for retrieving a file based on the provided key.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} A promise that resolves once the key route is generated
 */
export default async function getKeyRoute(req, res) {

    try {
        // Decode base64 key
        const toJson = decodeJsonKey(req.params.key);

        // Get binary from database
        const bin = await CLOUDDB.get(toJson.key);

        // Get file from the cloud
        const file = await CLOUDFILES.get(`${bin.key}.${bin.type}`);

        // Get default settings
        const styles = await CLOUDDBSETTINGS.get("settingskeydefault");

        // Transform the content of the file to a buffer
        const content = await fileToBuffer(file);

        // Verify whether or not the content is base64 encoded
        const output = checkIsBase64(content);

        if (bin.public) {

            // Read the short codes
            renderShortCodes(output);

            // Render the index template
            res.render("index", {
                baseUrl: `//${process.env.DETA_SPACE_APP_HOSTNAME}`,
                data: bin,
                content: parseShortCodesOutput(output),
                styles: styles.data,
                theme: styles.theme,
            });

        } else {
            // Render the error template
            res.render("error", renderError);
        }
    } catch (error) {
        console.error(error);
        // Render error template in case of exception
        res.render("error", renderError);
    }
}