/**
 * J-Card Template: Edit Actions
 *
 * Functions that the user invokes to edit the current instance.
 */

import { NUL_STRING, COVER_IMAGE } from "./constants.mjs";
import { replaceLineEnds } from "./functions.mjs";
import {
  getDataEntry,
  getOutput,
  setModifiedBy,
} from "./application-functions.mjs";

/**
 * Sets the visibility of the given class word on the given output to the value
 * of the given entry.
 */
export function setClassWord(output, classs, entry, invert = false) {
  if (entry.safeValue ^ invert) {
    output.element.classList.add(classs);
  } else {
    output.element.classList.remove(classs);
  }
  setModifiedBy(entry);
}

/** Sets the inner HTML of the given output to the value of the given entry. */
export function setInnerHtml(output, entry) {
  output.element.innerHTML = replaceLineEnds(entry.safeValue, "<br />");
  setModifiedBy(entry);
}

/**
 * Sets the back contents to the given output. This operates on one side only.
 */
export function setBackContents(
  output,
  label,
  contents,
  separator,
  shortBack,
  source
) {
  output.element.innerHTML = contents.safeValue
    ? (shortBack.safeValue && label.safeValue
        ? "<b>" + label.safeValue + ":&nbsp;&nbsp;</b>"
        : NUL_STRING) + replaceLineEnds(contents.safeValue, separator.safeValue)
    : NUL_STRING;
  setModifiedBy(source);
}

/** Sets the front contents to the given output. */
export function setFrontContents(
  output,
  aContents,
  bContents,
  separator,
  source
) {
  output.element.innerHTML = replaceLineEnds(
    [aContents, bContents]
      .map((entry) => {
        return entry.safeValue;
      })
      .join("\n"),
    separator.safeValue
  );
  setModifiedBy(source);
}

/** Sets the `src` of the given output to the file of the given entry. */
export function setSrc(output, entry) {
  const files = entry.safeValue;
  if (files.length) {
    const file = files[0];
    if (file) {
      const src = output.element.src;
      if (src) {
        URL.revokeObjectURL(src);
      }
      output.element.src = URL.createObjectURL(file);
      setModifiedBy(entry);
    }
  }
}

/**
 * Sets the given style of the given output to the value of the given entry and
 * the given suffix.
 */
export function setStyle(output, style, entry, suffix) {
  output.element.style[style] = entry.safeValue + suffix;
  setModifiedBy(entry);
}

/** Resets the cover image. */
export function resetCover() {
  const entry = getDataEntry("coverImage");
  entry.value = NUL_STRING;
  getOutput("cover").element.src = COVER_IMAGE;
  setModifiedBy(entry);
}
