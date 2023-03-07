/**
 * NET: Application Functions
 *
 * Functions operating on the application model.
 */

import {
  DATA_TYPE,
  FILE_EXTENSION,
  FILE_NAME_LENGTH_MAX,
} from "../constants.mjs";
import { application } from "../application-model.mjs";
import {
  NUL_OBJECT,
  NUL_STRING,
  EVENT_CHANGE,
  EVENT_INPUT,
  MESSAGES,
} from "./constants.mjs";
import { defaultOrAsIs } from "./functions.mjs";

/** For use with `getEntries`. */
const entries = (() => {
  const out = {};
  Object.entries(application.entries).forEach(([key, entries]) => {
    Object.entries(entries).forEach(([subKey, entry]) => {
      out[key + subKey.charAt(0).toUpperCase + subKey.substring(1)] = entry;
    });
  });
  return Object.freeze(out);
})();

/** Alerts the current file properties. */
export function alertFileProperties() {
  const file = getFile();
  if (file) {
    alert(
      "Name: " +
        file.name +
        "\nType: " +
        file.type +
        "\nSize: " +
        file.size +
        " bytes\nLast modified: " +
        new Date(file.lastModified).toISOString()
    );
  } else {
    alert(MESSAGES.fileNul);
  }
}

/** Downloads the given file by its name and URL. */
export function download(name = NUL_STRING, url = NUL_STRING) {
  const href = application.anchor.href;
  application.anchor.download = name;
  if (href !== url) {
    if (href) {
      URL.revokeObjectURL(href);
    }
    application.anchor.href = url;
  }
  application.anchor.click();
}

/**
 * Populates the given form entry values by their getter with the given values.
 * This is opposite to `preserve`.
 */
export function populate(values = NUL_OBJECT, getter = getEntries) {
  return Object.entries(getter()).forEach(([key, entry]) => {
    entry.value = defaultOrAsIs(entry.preset, values[key]);
  });
}

/**
 * Returns a snapshot of the given form entry values by their getter to the
 * given object. This is opposite to `populate`.
 */
export function preserve(getter = getEntries, object = {}) {
  Object.entries(getter()).forEach(([key, entry]) => {
    object[key] = entry.safeValue;
  });
  return object;
}

/** Prints the window. */
export function print() {
  return window.print();
}

/** Resets the given form entry values by their getters. */
export function reset(getters = [getEntries]) {
  return getters.forEach((getter) => {
    Object.values(getter()).forEach((entry) => {
      entry.value = entry.preset;
    });
  });
}

/** Saves the given form entry values by their preserver as a file download. */
export function save(preserver = preserve, name = NUL_STRING) {
  const file = new File(
    [JSON.stringify(preserver())],
    name.substring(0, FILE_NAME_LENGTH_MAX) + FILE_EXTENSION,
    { type: DATA_TYPE }
  );
  return download(file.name, URL.createObjectURL(file));
}

/**
 * Dispatches change or input events on the given form entries by their getters.
 */
export function update(getters = [getEntries]) {
  return getters.forEach((getter) => {
    Object.values(getter()).forEach((entry) => {
      entry.element.dispatchEvent(
        entry.element.type === "checkbox" || entry.element.type === "file"
          ? EVENT_CHANGE
          : EVENT_INPUT
      );
    });
  });
}

/** Returns collapsible fieldsets. */
export function getAccordions() {
  return application.accordions;
}

/** Returns the given form button by its key. */
export function getButton(key = NUL_STRING) {
  return getControl(getButtons, key);
}

/** Returns form buttons. */
export function getButtons() {
  return application.buttons;
}

/** Returns the given control by its getter and key. */
export function getControl(getter, key) {
  return getter()[key];
}

/** Returns the given form entry by its key. */
export function getEntry(key = NUL_STRING) {
  return getControl(getEntries, key);
}

/** Returns form entries. */
export function getEntries() {
  return entries;
}

/** Returns the current working file. */
export function getFile() {
  return application.instance.file;
}

/** Returns whether the current instance is modified. */
export function isModified() {
  return application.instance.modified;
}

/** Sets the modified flag to the given value. */
export function setModified(value = true) {
  return (application.instance.modified = value);
}

/** Returns the given output by its key. */
export function getOutput(key = NUL_STRING) {
  return getControl(getOutputs, key);
}

/** Returns outputs. */
export function getOutputs() {
  return application.outputs;
}

/** Returns the file reader. */
export function getReader() {
  return application.reader;
}

/** Returns the root element. */
export function getRoot() {
  return application.root;
}

/** Returns the source file input. */
export function getSource() {
  return application.source;
}
