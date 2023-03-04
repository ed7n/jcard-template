/**
 * J-Card Template: Event Setup
 *
 * Application event setup. A single call to `setupEvents` makes the magic
 * happen.
 */

import { NUL_STRING, MESSAGES } from "./constants.mjs";
import { getInputSafeValue, setWindowSubtitle } from "./functions.mjs";
import {
  loadFile,
  loadReader,
  print,
  resetCover,
  save,
  saveCover,
  doPrint,
  undoPrint,
  getButton,
  getDataEntry,
  getDataEntries,
  getLoadEntry,
  isModified,
  setModified,
  setModifiedBy,
  getOutputs,
  getPrintEntry,
  getPrintEntries,
  getReader,
  getRoot,
  getSaveEntry,
  getViewEntry,
} from "./application-functions.mjs";
import {
  setBooleanProperty,
  setClassWord,
  setInnerHtml,
  setInnerText,
  setProperty,
  setSrc,
  setStyleVariable,
  setBackContents,
  setFrontContents,
} from "./edits.mjs";
import { collapseAll, expandAll, setForceDark } from "./views.mjs";

/** Set post-modification events? */
let anesthesia = true;

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

/** Adds event listeners and their handlers to elements. */
export function setupEvents() {
  setupButtonEvents();
  setupEntryEvents();
  setupFileEvents();
  setupFormEvents();
  setupWindowEvents();
  setupViewEvents();
}

/** Adds listeners to buttons that invoke actions. */
function setupButtonEvents() {
  getButton("load").element.addEventListener("click", (event) => {
    loadFile(event.target.files);
  });
  getButton("print").element.addEventListener("click", print);
  getButton("resetCover").element.addEventListener("click", resetCover);
  getButton("save").element.addEventListener("click", save);
  getButton("saveCover").element.addEventListener("click", saveCover);
  getButton("viewCollapse").element.addEventListener("click", collapseAll);
  getButton("viewExpand").element.addEventListener("click", expandAll);
}

/** Adds listeners to entries that update outputs. */
function setupEntryEvents() {
  const i = getDataEntries();
  const o = getOutputs();
  addBackListener(
    i.sideALabel,
    i.sideAContents,
    i.contentsSeparator,
    i.shortBack,
    o.sideAContents
  );
  addBackListener(
    i.sideBLabel,
    i.sideBContents,
    i.contentsSeparator,
    i.shortBack,
    o.sideBContents
  );
  addClassListener(i.backContentsVisible, o.back, "hidden", true);
  addClassListener(i.blackAndWhite, o.root, "black-and-white");
  addClassListener(i.bold, o.root, "bold");
  addClassListener(i.fillCover, o.cover, "fill");
  addClassListener(i.forceCaps, o.root, "force-caps");
  addClassListener(i.frontContentsVisible, o.contents, "hidden", true);
  addClassListener(i.frontContentsVisible, o.frontTitleGroup, "center", true);
  addClassListener(i.frontTitleVisible, o.frontTitleGroup, "hidden", true);
  addClassListener(i.italicize, o.root, "italicize");
  addClassListener(i.print2, o.root, "print-2");
  addClassListener(i.reverse, o.root, "reverse");
  addClassListener(i.shortBack, o.root, "short-back");
  addClassListener(i.shortSpine, o.root, "short-spine");
  addClassListener(i.spineTitleVisible, o.spineTitleGroup, "hidden", true);
  addFrontListener(
    i.sideAContents,
    i.sideBContents,
    i.contentsSeparator,
    o.contents
  );
  addHtmlListener(i.footer, o.footer);
  addHtmlListener(i.noteLower, o.noteLower);
  addHtmlListener(i.noteUpper, o.noteUpper);
  addHtmlListener(i.sideALabel, o.sideALabel);
  addHtmlListener(i.sideBLabel, o.sideBLabel);
  addHtmlListener(i.titleLower, o.frontTitleLower);
  addHtmlListener(i.titleLower, o.spineTitleLower);
  addHtmlListener(i.titleUpper, o.frontTitleUpper);
  addHtmlListener(i.titleUpper, o.spineTitleUpper);
  addSrcListener(i.coverImage, o.cover);
  addSrcListener(getLoadEntry("cover"), o.cover);
  addStyleVariableListener(i, "backContentsAlignment");
  addStyleVariableListener(i, "backSize", "pt");
  addStyleVariableListener(i, "cardColor");
  addStyleVariableListener(i, "fontFamily");
  addStyleVariableListener(i, "fontSizeFactorInvert");
  addStyleVariableListener(i, "footerAlignment");
  addStyleVariableListener(i, "footerSize", "pt");
  addStyleVariableListener(i, "frontContentsAlignment");
  addStyleVariableListener(i, "frontSize", "pt");
  addStyleVariableListener(i, "frontTitleAlignment");
  addStyleVariableListener(i, "noteAlignment");
  addStyleVariableListener(i, "noteSize", "pt");
  addStyleVariableListener(i, "spineTitleAlignment");
  addStyleVariableListener(i, "textColor");
  addStyleVariableListener(i, "titleLowerSize", "pt");
  addStyleVariableListener(i, "titleUpperSize", "pt");
}

/** Adds listeners to file operators. */
function setupFileEvents() {
  getReader().addEventListener("load", () => {
    induceAnesthesia();
    loadReader();
    removeAnesthesia();
  });
}

/** Adds listeners to entries that update entries. */
function setupFormEvents() {
  const print2 = getDataEntry("print2");
  addBooleanProperty(
    getSaveEntry("follow"),
    getSaveEntry("name").element,
    "disabled"
  );
  Object.values(getPrintEntries()).forEach((entry) =>
    addBooleanProperty(print2, entry.element, "disabled")
  );
}

/** Adds listeners to entries that modifies the view. */
function setupViewEvents() {
  getSaveEntry("name").element.addEventListener("input", (event) => {
    setWindowSubtitle(getInputSafeValue(event.target));
  });
  getViewEntry("forceDark").element.addEventListener("change", (event) => {
    setForceDark(event.target.checked);
  });
  addClassListener(getViewEntry("reverse"), getRoot(), "reverse");
}

/** Adds listeners to the window. */
function setupWindowEvents() {
  window.addEventListener("beforeprint", () => {
    if (getDataEntry("print2").valueOrPreset) {
      doPrint(1, 2);
    } else {
      doPrint(
        getPrintEntry("start").valueOrPreset,
        getPrintEntry("count").valueOrPreset,
        getPrintEntry("margin").valueOrPreset,
        getPrintEntry("opacity").valueOrPreset,
        getPrintEntry("outline").valueOrPreset
      );
    }
  });
  window.addEventListener("afterprint", undoPrint);
}

/**
 * Adds a change event listener to the given entry that sets the given boolean
 * property.
 */
function addBooleanProperty(entry, object, key, invert) {
  entry.element.addEventListener("change", () => {
    if (setBooleanProperty(entry, object, key, invert) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds a change event listener to the given entry that sets the visibility of
 * the given class word of the given output.
 */
function addClassListener(entry, output, classs = NUL_STRING, invert) {
  entry.element.addEventListener("change", () => {
    if (setClassWord(output, classs, entry, invert) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the inner HTML of
 * the given output.
 */
function addHtmlListener(entry, output) {
  entry.element.addEventListener("input", () => {
    if (setInnerHtml(output, entry) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the given property.
 */
function addPropertyListener(entry, object, key) {
  entry.element.addEventListener("input", () => {
    if (setProperty(entry, object, key) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds a change event listener to the given entry that sets the source of the
 * given output.
 */
function addSrcListener(entry, output) {
  entry.element.addEventListener("change", () => {
    if (setSrc(output, entry) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the given style of
 * the given output.
 */
function addStyleListener(
  entry,
  output,
  style = NUL_STRING,
  suffix = NUL_STRING
) {
  entry.element.addEventListener("input", () => {
    if (setStyle(output, style, entry, suffix) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry by its key that sets the
 * given style variable of the application root element by the same key.
 */
function addStyleVariableListener(
  entries,
  key = NUL_STRING,
  suffix = NUL_STRING
) {
  const entry = entries[key];
  entry.element.addEventListener("input", () => {
    if (setStyleVariable(key, entry, suffix) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entry that sets the inner text of
 * the given output.
 */
function addTextListener(entry, output) {
  entry.element.addEventListener("input", () => {
    if (setInnerText(output, entry) && !hasAnesthesia()) {
      doAfterModify(entry);
    }
  });
}

/**
 * Adds an input event listener to the given entries that sets the back contents
 * to the given output.
 */
function addBackListener(label, contents, separator, shortBack, output) {
  [label, contents, separator, shortBack].forEach((entry) => {
    entry.element.addEventListener("input", () => {
      if (
        setBackContents(output, label, contents, separator, shortBack) &&
        !hasAnesthesia()
      ) {
        doAfterModify(entry);
      }
    });
  });
}

/**
 * Adds a `beforeunload` event listener to the window by modified flag and the
 * given entry.
 */
function addBeforeUnloadListenerBy(entry) {
  if (!isModified() && entry.save) {
    window.addEventListener("beforeunload", doBeforeUnload);
  }
}

/**
 * Adds an input event listener to the given entries that sets the front
 * contents to the given output.
 */
function addFrontListener(aContents, bContents, separator, output) {
  [aContents, bContents, separator].forEach((entry) => {
    entry.element.addEventListener("input", () => {
      if (
        setFrontContents(output, aContents, bContents, separator) &&
        !hasAnesthesia()
      ) {
        doAfterModify(entry);
      }
    });
  });
}

/** To be run after modification. */
function doAfterModify(entry) {
  addBeforeUnloadListenerBy(entry);
  setModifiedBy(entry);
}

/** For use during the window `beforeunload` event. */
function doBeforeUnload(event) {
  // TODO: While page visibility events are superior, we
  //       do not have a self-preserving mechanism.
  if (isModified()) {
    event.preventDefault();
    event.returnValue = MESSAGES.discard;
    return MESSAGES.discard;
  }
}

/** Returns whether it is setting post-modification events. */
function hasAnesthesia() {
  return anesthesia;
}
