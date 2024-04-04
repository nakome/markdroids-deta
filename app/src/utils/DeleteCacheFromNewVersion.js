import config from "../config/lang.json";

/**
 * Delete cache from previous versions if detected and update the stored version.
 *
 * @param {string} name - The name of the version stored in localStorage
 * @param {string} version - The current version of the application
 */
const DeleteCacheFromNewVersion = (name, version) => {
  // Update this with the current version of your application.
  const currentVersion = version;
  const storageVersion = localStorage.getItem(name);

  if (storageVersion !== currentVersion) {
    let ask = confirm(config.newVersionDetected);
    if (ask) {
      // Delete locally stored data
      localStorage.clear();
      sessionStorage.clear();
      // ... You can add other cleanup operations if necessary
      // Update the stored version
      localStorage.setItem(name, currentVersion);
      location.reload();
    }
  }
};

export default DeleteCacheFromNewVersion;
