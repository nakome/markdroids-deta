
export const renderError = {
  baseUrl: `//${process.env.DETA_SPACE_APP_HOSTNAME}`,
  data: [],
};

/**
 * Generates a JSON response with status 404 and an empty data array.
 *
 * @param {Object} res - the response object
 * @return {Object} the JSON response with status 404 and empty data array
 */
export const jsonError = (res) => {
  try {
    return res.json({
      status: 404,
      data: [],
    });
  } catch (error) {
    // Handle any errors that may occur when returning the JSON response
    console.error("An error occurred while returning the JSON response.:", error);
    return null;
  }
};