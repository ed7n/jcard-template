/**
 * NET: Event Manager
 *
 * Event setup functions and post-modification manager.
 */

import { doAfterModify, doBeforeUnload } from "../events.mjs";
import { NUL_FUNCTION, NUL_OBJECT, NUL_STRING } from "./constants.mjs";
import { setModified } from "./application-functions.mjs";
import * as ECC from "./ecc.mjs";
import {
  setBooleanProperty,
  setClassWord,
  setInnerHtml,
  setInnerText,
  setProperty,
  setSrc,
  setStyleVariable,
} from "./edits.mjs";

/** Enable coalescing. */
export const OPTIONS_COALESCE = Object.freeze({ coalesce: true });
/** Enable coalescing and invert. */
export const OPTIONS_COALESCE_INVERT = Object.freeze({
  coalesce: true,
  invert: true,
});
/** Invert. */
export const OPTIONS_INVERT = Object.freeze({ invert: true });

/** Set post-modification events? */
let anesthesia = true;

/**
 * Adds a click event listener to the given button that runs the given function.
 */
export function addActionListener(button, action) {
  button.element.addEventListener("click", action);
}

/**
 * Adds a change event listener to the given entry that sets the given boolean
 * property.
 */
export function addBooleanListener(entry, object, key, options = NUL_OBJECT) {
  entry.element.addEventListener(
    "change",
    makeHandler(() => {
      if (
        setBooleanProperty(entry, object, key, options.invert) &&
        !hasAnesthesia()
      ) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds a change event listener to the given entry that sets the visibility of
 * the given class word of the given output.
 */
export function addClassListener(entry, output, classs, options = NUL_OBJECT) {
  entry.element.addEventListener(
    "change",
    makeHandler(() => {
      if (
        setClassWord(output, classs, entry, options.invert) &&
        !hasAnesthesia()
      ) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds an input event listener to the given entry that sets the inner HTML of
 * the given output.
 */
export function addHtmlListener(entry, output, options = NUL_OBJECT) {
  entry.element.addEventListener(
    "input",
    makeHandler(() => {
      if (setInnerHtml(output, entry) && !hasAnesthesia()) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds an input event listener to the given entry that sets the given property.
 */
export function addPropertyListener(entry, object, key, options = NUL_OBJECT) {
  entry.element.addEventListener(
    "input",
    makeHandler(() => {
      if (setProperty(entry, object, key) && !hasAnesthesia()) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds a change event listener to the given entry that sets the source of the
 * given output.
 */
export function addSrcListener(entry, output, options = NUL_OBJECT) {
  entry.element.addEventListener(
    "change",
    makeHandler(() => {
      if (setSrc(output, entry) && !hasAnesthesia()) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds an input event listener to the given entry that sets the given style of
 * the given output.
 */
export function addStyleListener(
  entry,
  output,
  style = NUL_STRING,
  options = NUL_OBJECT
) {
  entry.element.addEventListener(
    "input",
    makeHandler(() => {
      if (setStyle(output, style, entry, options.suffix) && !hasAnesthesia()) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds an input event listener to the given entry by its key that sets the
 * given style variable of the application root element by the same key.
 */
export function addStyleVariableListener(
  entries,
  key = NUL_STRING,
  options = NUL_OBJECT
) {
  const entry = entries[key];
  entry.element.addEventListener(
    "input",
    makeHandler(() => {
      if (setStyleVariable(key, entry, options.suffix) && !hasAnesthesia()) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/**
 * Adds an input event listener to the given entry that sets the inner text of
 * the given output.
 */
export function addTextListener(entry, output, options = NUL_OBJECT) {
  entry.element.addEventListener(
    "input",
    makeHandler(() => {
      if (setInnerText(output, entry) && !hasAnesthesia()) {
        doAfterModify(entry);
      }
    }, options)
  );
}

/** Returns the given function either wrapped with ECC or as is. */
export function makeHandler(functionn = NUL_FUNCTION, options = NUL_OBJECT) {
  if (options.coalesce) {
    const symbol = Symbol();
    return () => ECC.register(symbol, functionn);
  }
  return functionn;
}

/** Undoes and disables setting of post-modification events. */
export function induceAnesthesia() {
  anesthesia = true;
  setModified(false);
  window.removeEventListener("beforeunload", doBeforeUnload);
}

/** Resumes setting of post-modification events. */
export function removeAnesthesia() {
  anesthesia = false;
}

/** Returns whether it is setting post-modification events. */
export function hasAnesthesia() {
  return anesthesia;
}
