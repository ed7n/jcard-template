/**
 * NET: Functions
 *
 * Shared independent functions.
 */

import { regexps } from "../constants.mjs";
import {
  NUL_ELEMENT,
  NUL_STRING,
  MESSAGES,
  TITLE,
  regexps as commonRegexps,
} from "./constants.mjs";

/**
 * Returns the given primitive, passing undefined or null returns the given
 * default.
 */
export function defaultOrAsIs(defaultt, primitive) {
  return primitive === undefined || primitive === null ? defaultt : primitive;
}

/**
 * Returns the fail-safe value of the given input, select, or textarea element.
 */
export function getInputSafeValue(element = NUL_ELEMENT, preset) {
  switch (element.tagName) {
    case "INPUT":
      switch (element.type) {
        case undefined:
          return undefined;
        case "checkbox":
        case "radio":
          return element.checked;
        case "file":
          return element.files;
        case "number":
          return element.value.length && element.checkValidity()
            ? element.value
            : defaultOrAsIs(0, preset);
      }
    case "SELECT":
    case "TEXTAREA":
      return element.checkValidity()
        ? element.value
        : defaultOrAsIs(NUL_STRING, preset);
  }
}

/** Sets the value of the given input, select, or textarea element. */
export function setInputValue(element = NUL_ELEMENT, value = NUL_STRING) {
  switch (element.tagName) {
    case "INPUT":
      switch (element.type) {
        case undefined:
          return undefined;
        case "checkbox":
        case "radio":
          return (element.checked = Boolean(value));
        case "file":
          if (value instanceof FileList) {
            return (element.files = value);
          } else if (value !== NUL_STRING) {
            return;
          }
      }
    case "SELECT":
    case "TEXTAREA":
      return (element.value = value);
  }
}

/** Shorthand for `element.querySelector(query)`. */
export function qs(element = NUL_ELEMENT, query = NUL_STRING) {
  return element.querySelector(query);
}

/** Shorthand for `element.querySelectorAll(query)`. */
export function qsAll(element = NUL_ELEMENT, query = NUL_STRING) {
  return element.querySelectorAll(query);
}

/** Replaces line ends in the given string with the given replacement. */
export function replaceLineEnds(string = NUL_STRING, replacement = NUL_STRING) {
  return string.replace(commonRegexps.lineEnd, replacement);
}

/** Tests the given file and alerts on a fault. */
export function testFile(file) {
  if (file.size) {
    if (regexps.fileType.test(file.type)) {
      return true;
    }
    alert(MESSAGES.fileBadType + (file.type || "(empty)"));
  } else {
    alert(MESSAGES.fileEmpty);
  }
  return false;
}

/** Sets the window subtitle to the given value. */
export function setWindowSubtitle(subtitle) {
  return (document.title = (subtitle ? subtitle + " - " : NUL_STRING) + TITLE);
}
