import { Deta } from "deta";
import fileToBuffer from "../../modules/fileToBuffer.js";
import imageType from "image-type";

const deta = Deta();
const CLOUDIMAGES = deta.Drive("images");

/**
 * Get JSON photos by name.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} Promise representing the completion of the function
 */
export default async function getJsonPhotosByName(req, res) {
    try {
        let name = req.params.name;
        const response = await CLOUDIMAGES.get(name);

        // We convert the image
        const content = await fileToBuffer(response);

        // Set header type
        let type = await imageType(content);
        res.setHeader("Content-Type", type.mime);

        // Sends the image buffer directly
        res.send(content);
    } catch (error) {
        console.error("Error getting the image:", error);
        res.status(500).json({ error: error });
    }
}