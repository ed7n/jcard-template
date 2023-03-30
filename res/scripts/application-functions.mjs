/**
 * J-Card Template: Application Functions
 *
 * Functions operating on the application model. Whenever unavailable, operate
 * directly on the model.
 */

import {
  COVER_IMAGE,
  DATA_VERSION,
  FILE_NAME,
  FILE_SIZE_MAX_SAFE,
  MESSAGES,
  regexps,
} from "./constants.mjs";
import { application } from "./application-model.mjs";
import {
  NUL_OBJECT,
  NUL_STRING,
  EVENT_INPUT,
  MESSAGES as COMMON_MESSAGES,
} from "./common/constants.mjs";
import { testFile } from "./common/functions.mjs";
import {
  download,
  populate,
  preserve,
  print,
  save,
  update,
  getControl,
  getFile,
  isModified,
  setModified,
  getOutput,
  getReader,
  getSource,
} from "./common/application-functions.mjs";

/** For use with `getDataSaveEntries`. */
const dataSaveEntries = (() => {
  const out = {};
  Object.entries(getDataEntries())
    .filter(([, entry]) => entry.save)
    .forEach(([key, entry]) => {
      out[key] = entry;
    });
  return Object.freeze(out);
})();
/** For use with `loadReader`. */
const dataVolatileEntries = Object.entries(getDataEntries()).filter(
  ([, entry]) => !entry.persistent && !entry.save
);

/** Closes the current instance. */
export function close() {
  setWindowSubtitle();
  getSource().value = NUL_STRING;
  application.instance.file = null;
}

/**
 * Loads the file at the given index of the given list. If successful, then this
 * may be followed by `loadReader`.
 */
export function loadFile(files = getSource().value, index = 0) {
  getSource().element.disabled = true;
  if (files.length) {
    const file = files[index];
    if (
      testFile(file) &&
      (file.size <= FILE_SIZE_MAX_SAFE || confirm(MESSAGES.loadLarge)) &&
      (!isModified() || confirm(MESSAGES.loadDiscard))
    ) {
      getReader().readAsText(file);
      return (application.instance.file = file);
    }
  } else {
    alert(COMMON_MESSAGES.loadEmpty);
  }
  getSource().element.disabled = false;
}

/** Loads the reader contents into the current instance. */
export function loadReader() {
  let data;
  try {
    data = JSON.parse(getReader().result);
  } catch (error) {
    alert(error.toString());
    getSource().element.disabled = false;
    return;
  }
  populateDataSaves(data);
  if (data.print2) {
    getPrintEntry("count").value = 2;
  }
  dataVolatileEntries.forEach((entry) => {
    entry.value = entry.preset;
  });
  const name = getSaveEntry("name");
  name.value = getFile().name.replace(regexps.fileExtension, NUL_STRING);
  name.element.dispatchEvent(EVENT_INPUT);
  updateData();
  getSource().element.disabled = false;
}

/**
 * Populates data form entry values that are to be saved with the given values.
 */
export function populateDataSaves(values = NUL_OBJECT) {
  return populate(values, getDataSaveEntries);
}

/** Returns a snapshot of data form entry values that are to be saved. */
export function preserveDataSaves() {
  const out = { version: DATA_VERSION };
  return preserve(getDataSaveEntries, out);
}

/** Saves data form entries that are to be saved as a file download. */
export function saveDataSaves() {
  return save(preserveDataSaves, getCardName());
}

/** Dispatches change or input events on data form entries. */
export function updateData() {
  return update([getDataEntries]);
}

/** Resets the cover image. */
export function resetCover() {
  const entry = getDataEntry("coverImage");
  entry.value = NUL_STRING;
  getOutput("cover").element.src = COVER_IMAGE;
  setModifiedBy(entry);
}

/** Saves the cover image as a file download. */
export function saveCover() {
  return download(getCardName(), getOutput("cover").element.src);
}

/** Prints the window only if print form entries are good. */
export function testAndPrint() {
  if (testPrintEntries()) {
    return print();
  }
}

/** Returns whether print form entries are valid and reports on a fault. */
export function testPrintEntries() {
  try {
    Object.values(getPrintEntries()).forEach((entry) => {
      if (!entry.element.reportValidity()) {
        throw new Error();
      }
    });
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * In their parent: prepends a given number of blanks; and appends a given
 * number of the template root element. The parameters correspond to those in
 * the Print section.
 */
export function doPrint(
  start = 1,
  count = 1,
  margin = NUL_STRING,
  opacity = 1,
  outline = false
) {
  const element = getOutput("root").element;
  switch (margin) {
    case "variable":
      element.classList.add("variable-width");
    case "half":
      element.classList.add("half-margin");
  }
  if (outline) {
    element.classList.add("outline");
  }
  const blank = element.cloneNode(true);
  element.style.opacity = opacity;
  blank.style.opacity = 0;
  const parent = element.parentElement;
  while (start-- > 1) {
    parent.prepend(blank.cloneNode(true));
  }
  while (count-- > 1) {
    parent.append(element.cloneNode(true));
  }
}

/**
 * Undoes `doPrint`; removes siblings of the template root element, and clears
 * its added properties.
 */
export function undoPrint() {
  const element = getOutput("root").element;
  ["previousElementSibling", "nextElementSibling"].forEach((neighbor) => {
    let sibling = element[neighbor];
    while (sibling) {
      sibling.remove();
      sibling = element[neighbor];
    }
  });
  element.style.opacity = NUL_STRING;
  element.classList.remove("half-margin", "outline", "variable-width");
}

/** Returns the given application form entry by its key. */
export function getApplicationEntry(key = NUL_STRING) {
  return getControl(getApplicationEntries, key);
}

/** Returns application form entries. */
export function getApplicationEntries() {
  return application.entries.application;
}

/** Returns the current card name. */
export function getCardName() {
  return (
    (getSaveEntry("follow").valueOrLkgOrPreset
      ? getDataEntry("titleUpper").valueOrLkgOrPreset ||
        getDataEntry("titleLower").valueOrLkgOrPreset
      : getSaveEntry("name").valueOrLkgOrPreset) || FILE_NAME
  );
}

/** Returns the given data form entry by its key. */
export function getDataEntry(key = NUL_STRING) {
  return getControl(getDataEntries, key);
}

/** Returns data form entries. */
export function getDataEntries() {
  return application.entries.data;
}

/** Returns data form entries that are to be saved. */
export function getDataSaveEntries() {
  return dataSaveEntries;
}

/** Returns the given load form entry by its key. */
export function getLoadEntry(key = NUL_STRING) {
  return getControl(getLoadEntries, key);
}

/** Returns load form entries. */
export function getLoadEntries() {
  return application.entries.load;
}

/** Sets the modified flag by the given data entry. */
export function setModifiedBy(entry = NUL_OBJECT) {
  return setModified(isModified() || entry.save || false);
}

/** Returns the current instance name. */
export function getName() {
  return getSaveEntry("name").safeValue;
}

/** Returns the given print form entry by its key. */
export function getPrintEntry(key = NUL_STRING) {
  return getControl(getPrintEntries, key);
}

/** Returns print form entries. */
export function getPrintEntries() {
  return application.entries.print;
}

/** Returns the given save form entry by its key. */
export function getSaveEntry(key = NUL_STRING) {
  return getControl(getSaveEntries, key);
}

/** Returns save form entries. */
export function getSaveEntries() {
  return application.entries.save;
}

/** Returns the given view form entry by its key. */
export function getViewEntry(key = NUL_STRING) {
  return getControl(getViewEntries, key);
}

/** Returns view form entries. */
export function getViewEntries() {
  return application.entries.view;
}
