/**
 * J-Card Template: Event Setup
 *
 * A single call to `setupEvents` makes the magic happen.
 */

import { FILE_NAME, MESSAGES } from "./constants.mjs";
import {
  loadFile,
  loadReader,
  resetCover,
  saveCover,
  saveDataSaves,
  testAndPrint,
  doPrint,
  undoPrint,
  getApplicationEntry,
  getApplicationEntries,
  getDataEntry,
  getDataEntries,
  getLoadEntry,
  setModifiedBy,
  getPrintEntry,
  getPrintEntries,
  getSaveEntry,
  getViewEntry,
} from "./application-functions.mjs";
import { setBackContents, setFrontContents } from "./edits.mjs";
import { NUL_OBJECT } from "./common/constants.mjs";
import { getInputSafeValue, setWindowSubtitle } from "./common/functions.mjs";
import {
  getButtons,
  isModified,
  getOutputs,
  getReader,
  getRoot,
} from "./common/application-functions.mjs";
import * as ECC from "./common/ecc.mjs";
import {
  OPTIONS_COALESCE,
  OPTIONS_COALESCE_INVERT,
  addActionListener,
  addBooleanListener,
  addClassListener,
  addHtmlListener,
  addSrcListener,
  addStyleVariableListener,
  makeHandler,
  doAfterEdit,
  doBeforeEdit,
  induceAnesthesia,
  removeAnesthesia,
  hasAnesthesia,
} from "./common/events.mjs";
import { collapseAll, expandAll, setForceDark } from "./common/views.mjs";

/** Enable coalescing and append with "pt". */
const OPTIONS_COALESCE_PT = Object.freeze({ coalesce: true, suffix: "pt" });

/** Adds event listeners and their handlers to elements. */
export function setupEvents() {
  setupApplicationEvents();
  setupButtonEvents();
  setupEntryEvents();
  setupFileEvents();
  setupFormEvents();
  setupViewEvents();
  setupWindowEvents();
}

/** To be run after modification. */
export function doAfterModify(entry) {
  addBeforeUnloadListenerBy(entry);
  setModifiedBy(entry);
}

/** For use during the window `beforeunload` event. */
export function doBeforeUnload(event) {
  // TODO: While page visibility events are superior, we
  //       do not have a self-preserving mechanism.
  if (isModified()) {
    event.preventDefault();
    event.returnValue = MESSAGES.loadDiscard;
    return MESSAGES.loadDiscard;
  }
}

/** Adds listeners to entries that modify the application. */
function setupApplicationEvents() {
  getApplicationEntry("ecc").element.addEventListener("change", (event) => {
    ECC.setBypass(!getInputSafeValue(event.target));
  });
}

/** Adds listeners to buttons that invoke actions. */
function setupButtonEvents() {
  const buttons = getButtons();
  addActionListener(buttons.load, (event) =>
    loadFile(getInputSafeValue(event.target))
  );
  addActionListener(buttons.coverReset, resetCover);
  addActionListener(buttons.print, testAndPrint);
  addActionListener(buttons.save, saveDataSaves);
  addActionListener(buttons.saveCover, saveCover);
  addActionListener(buttons.viewCollapse, collapseAll);
  addActionListener(buttons.viewExpand, expandAll);
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
    o.sideAContents,
    OPTIONS_COALESCE
  );
  addBackListener(
    i.sideBLabel,
    i.sideBContents,
    i.contentsSeparator,
    i.shortBack,
    o.sideBContents,
    OPTIONS_COALESCE
  );
  addClassListener(
    i.backContentsVisible,
    o.back,
    "hidden",
    OPTIONS_COALESCE_INVERT
  );
  addClassListener(i.bold, o.root, "bold", OPTIONS_COALESCE);
  addClassListener(i.fillCover, o.cover, "fill", OPTIONS_COALESCE);
  addClassListener(i.forceCaps, o.root, "force-caps", OPTIONS_COALESCE);
  addClassListener(
    i.frontContentsVisible,
    o.contents,
    "hidden",
    OPTIONS_COALESCE_INVERT
  );
  addClassListener(
    i.frontContentsVisible,
    o.frontTitleGroup,
    "center",
    OPTIONS_COALESCE_INVERT
  );
  addClassListener(
    i.frontTitleVisible,
    o.frontTitleGroup,
    "hidden",
    OPTIONS_COALESCE_INVERT
  );
  addClassListener(i.italicize, o.root, "italicize", OPTIONS_COALESCE);
  addClassListener(i.reverse, o.root, "reverse", OPTIONS_COALESCE);
  addClassListener(i.shortBack, o.root, "short-back", OPTIONS_COALESCE);
  addClassListener(i.shortSpine, o.root, "short-spine", OPTIONS_COALESCE);
  addClassListener(
    i.spineTitleVisible,
    o.spineTitleGroup,
    "hidden",
    OPTIONS_COALESCE_INVERT
  );
  addFrontListener(
    i.sideAContents,
    i.sideBContents,
    i.contentsSeparator,
    o.contents,
    OPTIONS_COALESCE
  );
  addHtmlListener(i.footer, o.footer, OPTIONS_COALESCE);
  addHtmlListener(i.noteLower, o.noteLower, OPTIONS_COALESCE);
  addHtmlListener(i.noteUpper, o.noteUpper, OPTIONS_COALESCE);
  addHtmlListener(i.sideALabel, o.sideALabel, OPTIONS_COALESCE);
  addHtmlListener(i.sideBLabel, o.sideBLabel, OPTIONS_COALESCE);
  addHtmlListener(i.titleLower, o.frontTitleLower, OPTIONS_COALESCE);
  addHtmlListener(i.titleLower, o.spineTitleLower, OPTIONS_COALESCE);
  addHtmlListener(i.titleUpper, o.frontTitleUpper, OPTIONS_COALESCE);
  addHtmlListener(i.titleUpper, o.spineTitleUpper, OPTIONS_COALESCE);
  addSrcListener(i.coverImage, o.cover);
  addSrcListener(getLoadEntry("cover"), o.cover);
  addStyleVariableListener(i, "backContentsAlignment", OPTIONS_COALESCE);
  addStyleVariableListener(i, "backSize", OPTIONS_COALESCE_PT);
  addStyleVariableListener(i, "cardColor", OPTIONS_COALESCE);
  addStyleVariableListener(i, "coverHeightFactor", OPTIONS_COALESCE);
  addStyleVariableListener(i, "fontFamily", OPTIONS_COALESCE);
  addStyleVariableListener(i, "footerAlignment", OPTIONS_COALESCE);
  addStyleVariableListener(i, "footerSize", OPTIONS_COALESCE_PT);
  addStyleVariableListener(i, "frontContentsAlignment", OPTIONS_COALESCE);
  addStyleVariableListener(i, "frontSize", OPTIONS_COALESCE_PT);
  addStyleVariableListener(i, "frontTitleAlignment", OPTIONS_COALESCE);
  addStyleVariableListener(i, "noteAlignment", OPTIONS_COALESCE);
  addStyleVariableListener(i, "noteSize", OPTIONS_COALESCE_PT);
  addStyleVariableListener(i, "spineTitleAlignment", OPTIONS_COALESCE);
  addStyleVariableListener(i, "textColor", OPTIONS_COALESCE);
  addStyleVariableListener(i, "titleLowerSize", OPTIONS_COALESCE_PT);
  addStyleVariableListener(i, "titleUpperSize", OPTIONS_COALESCE_PT);
  addStyleVariableListener(
    getApplicationEntries(),
    "fontSizeFactorInvert",
    OPTIONS_COALESCE
  );
}

/** Adds listeners to file operators. */
function setupFileEvents() {
  getReader().addEventListener("load", () => {
    induceAnesthesia();
    loadReader();
    ECC.flush();
    removeAnesthesia();
  });
  getRoot().element.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  getRoot().element.addEventListener("drop", (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      loadFile(event.dataTransfer.files);
    }
  });
}

/** Adds listeners to entries that update entries. */
function setupFormEvents() {
  addBooleanListener(
    getDataEntry("fillCover"),
    getDataEntry("coverHeightFactor").element,
    "disabled"
  );
  addBooleanListener(
    getSaveEntry("follow"),
    getSaveEntry("name").element,
    "disabled"
  );
}

/** Adds listeners to entries that modify the view. */
function setupViewEvents() {
  addClassListener(getViewEntry("reverse"), getRoot(), "reverse");
  getSaveEntry("name").element.addEventListener(
    "input",
    makeHandler((event) => {
      setWindowSubtitle(getInputSafeValue(event.target) || FILE_NAME);
    }, OPTIONS_COALESCE)
  );
  getViewEntry("forceDark").element.addEventListener("change", (event) => {
    setForceDark(getInputSafeValue(event.target));
  });
}

/** Adds listeners to the window. */
function setupWindowEvents() {
  window.addEventListener("beforeprint", () => {
    ECC.flush();
    doPrint(
      getPrintEntry("start").valueOrLkgOrPreset,
      getPrintEntry("count").valueOrLkgOrPreset,
      getPrintEntry("margin").valueOrLkgOrPreset,
      getPrintEntry("opacity").valueOrLkgOrPreset,
      getPrintEntry("outline").valueOrLkgOrPreset
    );
  });
  window.addEventListener("afterprint", undoPrint);
}

/**
 * Adds an input event listener to the given entries that sets the back contents
 * to the given output.
 */
function addBackListener(
  label,
  contents,
  separator,
  shortBack,
  output,
  options = NUL_OBJECT
) {
  [label, contents, separator, shortBack].forEach((entry) => {
    entry.element.addEventListener(
      "input",
      makeHandler(() => {
        return (
          doBeforeEdit(entry) &&
          setBackContents(output, label, contents, separator, shortBack) &&
          doAfterEdit(entry)
        );
      }, options)
    );
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
function addFrontListener(
  aContents,
  bContents,
  separator,
  output,
  options = NUL_OBJECT
) {
  [aContents, bContents, separator].forEach((entry) => {
    entry.element.addEventListener(
      "input",
      makeHandler(() => {
        return (
          doBeforeEdit(entry) &&
          setFrontContents(output, aContents, bContents, separator) &&
          doAfterEdit(entry)
        );
      }, options)
    );
  });
}
