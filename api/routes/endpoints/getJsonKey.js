import { Deta } from "deta";
import decodeJsonKey from "../../modules/decodeJsonKey.js";
import fileToBuffer from "../../modules/fileToBuffer.js";
import checkIsBase64 from "../../modules/checkIsBase64.js";
import {parseShortCodes,parseShortCodesOutput} from "../../modules/parseShortCodes.js";
import renderShortCodes from "../../modules/ShortCodes.js";

const deta = Deta();
const CLOUDFILES = deta.Drive("cloud");
const CLOUDDB = deta.Base("bin");
const CLOUDDBSETTINGS = deta.Base("settings");

/**
 * Function to retrieve a JSON key and process it.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Object} returns JSON data or an error message
 */
export default async function getJsonKey(req, res) {
    try {

        // Decode base64 key
        const toJson = decodeJsonKey(req.params.key);

        // Vars
        const bin = await CLOUDDB.get(toJson.key);

        // Get file
        const file = await CLOUDFILES.get(`${bin.key}.${bin.type}`);

        // Get default settings
        const styles = await CLOUDDBSETTINGS.get("settingskeydefault");

        // Transform the spot buffer
        const content = await fileToBuffer(file);

        // Check is decode or base64-encoded
        const output = checkIsBase64(content);

        // It is public
        if (bin.public) {

            // Read short codes
            renderShortCodes(output);

            // Rendered
            res.json({
                status: 200,
                date: bin.update,
                name: bin.name,
                html: parseShortCodesOutput(output),
                markdown: parseShortCodes(output),
                css: styles.data,
                theme: styles.theme,
            });

        } else {
            jsonError(res);
        }
    } catch (error) {
        console.error("Error getting the image:", error);
        res.status(500).json({ error: error });
    }
}