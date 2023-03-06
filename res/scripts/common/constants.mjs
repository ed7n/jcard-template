/**
 * NET: Constants
 *
 * Shared independent constants.
 */

export const NUL_ARRAY = Object.freeze([]);
export const NUL_ELEMENT = Object.freeze(document.createElement(null));
export const NUL_FUNCTION = Object.freeze(Function());
export const NUL_OBJECT = Object.freeze({});
export const NUL_STRING = "";
export const SPACE = " ";

/** Event: "change". */
export const EVENT_CHANGE = Object.freeze(new Event("change"));
/** Event: "input". */
export const EVENT_INPUT = Object.freeze(new Event("input"));
/** Initial document title. */
export const TITLE = document.title;

/** Regular Expressions. */
export const regexps = Object.freeze({
  /** Line end with trailing and leading blanks. */
  lineEnd: new RegExp(/\s*(\n|\r\n|\r)\s*/g),
});