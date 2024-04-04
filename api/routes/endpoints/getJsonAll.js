import { Deta } from "deta";
import { encodeUnicode } from "../../modules/utils.js";

const deta = Deta();
const CLOUDDB = deta.Base("bin");

/**
 * Function to retrieve all JSON data and filter the public items.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} returns a promise
 */
export default async function getJsonAll(req, res) {
    try {
        // Vars
        const bin = await CLOUDDB.fetch();

        const publicBins = bin.items.filter((item) => {
            if (item.public) {
                item.uid = encodeUnicode(
                    JSON.stringify({ key: item.key, update: item.update })
                );
                return true;
            }
            return false;
        });

        res.json({ status: 200, count: publicBins.length, data: publicBins });

    } catch (error) {
        console.error(error);
        jsonError(res);
    }
}