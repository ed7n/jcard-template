/**
 * J-Card Template: Constants
 *
 * Shared independent constants.
 */

export const NUL_ARRAY = Object.freeze([]);
export const NUL_ELEMENT = Object.freeze(document.createElement(null));
export const NUL_FUNCTION = Object.freeze(Function());
export const NUL_OBJECT = Object.freeze({});
export const NUL_STRING = "";
export const SPACE = " ";

/** Messages. */
export const MESSAGES = Object.freeze({
  discard: "This will discard any unsaved changes made to the current J-card.",
  fileBadType: "Bad file MIME type: ",
  fileEmpty: "File is empty.",
  loadEmpty: "Nothing to load.",
});
/** Default cover image source. */
export const COVER_IMAGE = "res/media/cover.png";
/** CSS custom property namespace. */
export const CSS_NAMESPACE = "jCard";
/** Data version. */
export const DATA_VERSION = "1A";
/** Event: "change". */
export const EVENT_CHANGE = Object.freeze(new Event("change"));
/** Event: "input". */
export const EVENT_INPUT = Object.freeze(new Event("input"));
/** Data file name extension. */
export const FILE_EXTENSION = ".jcard.json";
/** Maximum file name length in characters. */
export const FILE_NAME_MAX_LENGTH = 255 - FILE_EXTENSION.length;
/** Default file name. */
export const FILE_NAME = "Unnamed J-Card";
/** Data file MIME type. */
export const FILE_TYPE = "application/json";
/** Initial document title. */
export const TITLE = document.title;

/** Regular Expressions. */
export const regexps = Object.freeze({
  /** Data file name extension. */
  fileExtension: new RegExp(/(\.jcard)?\.json$/),
  /** Line end with trailing and leading blanks. */
  lineEnd: new RegExp(/\s*(\n|\r\n|\r)\s*/g),
  /** JSON MIME type and subtypes. */
  json: new RegExp(/^(application\/json|text\/)/),
});
