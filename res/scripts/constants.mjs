/**
 * J-Card Template: Constants
 *
 * Shared independent constants.
 */

/** Messages. */
export const MESSAGES = Object.freeze({
  loadDiscard: "This discards any unsaved changes made to the current J-card.",
  loadLarge: "Its size is greater than 1 MiB, proceed with loading?",
});
/** CSS custom property prefix. */
export const CSS_PREFIX = "jCard";
/** Data MIME type. */
export const DATA_TYPE = "application/json";
/** Data version. */
export const DATA_VERSION = "2";
/** Data file name extension. */
export const FILE_EXTENSION = ".jcard.json";
/** Maximum file name length in characters. */
export const FILE_NAME_LENGTH_MAX = 255 - FILE_EXTENSION.length;
/** Default file name. */
export const FILE_NAME = "Unnamed";
/** Maximum safe file size in bytes. */
export const FILE_SIZE_MAX_SAFE = 1048576;

/** Default cover image source. */
export const COVER_IMAGE = "res/media/cover.png";

/** Regular Expressions. */
export const regexps = Object.freeze({
  /** Source file name extension. */
  fileExtension: new RegExp(/(\.jcard)?\.json$/),
  /** Source file MIME type. */
  fileType: new RegExp(/^(application\/json|text\/)/),
});
