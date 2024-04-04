import { Deta } from "deta";

const deta = Deta();
const CLOUDIMAGES = deta.Drive("images");

/**
 * Generates a JSON array of photo objects from cloud images and sends it as a response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {void}
 */
export default async function getJsonPhotos(req, res) {
    try {

        let images = await CLOUDIMAGES.list();

        const arr = [];
        if (Array.isArray(images.names)) {
            for (const item of images.names) {
                arr.push({
                    name: item,
                    type: item.split(".").pop(),
                    url: `/api/json/photos/${item}`,
                });
            }
        }

        // Send response
        res.json({ status: 200, data: arr });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}