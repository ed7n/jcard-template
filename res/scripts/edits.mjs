/**
 * J-Card Template: Edit Actions
 *
 * Functions that the user invokes to edit the current instance.
 */

import { NUL_STRING, COVER_IMAGE, CSS_NAMESPACE } from "./constants.mjs";
import { replaceLineEnds } from "./functions.mjs";
import {
  getDataEntry,
  getOutput,
  setModifiedBy,
  getRoot,
} from "./application-functions.mjs";

/**
 * Sets the visibility of the given class word on the given output to the value
 * of the given entry.
 */
export function setClassWord(output, classs, entry, invert = false) {
  if (entry.valueOrPreset ^ invert) {
    output.element.classList.add(classs);
  } else {
    output.element.classList.remove(classs);
  }
  setModifiedBy(entry);
}

/** Sets the inner HTML of the given output to the value of the given entry. */
export function setInnerHtml(output, entry) {
  output.element.innerHTML = replaceLineEnds(entry.valueOrPreset, "<br />");
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
  output.element.innerHTML = contents.valueOrPreset
    ? (shortBack.valueOrPreset && label.valueOrPreset
        ? '<span class="bold">' + label.valueOrPreset + ":&nbsp;&nbsp;</span>"
        : NUL_STRING) +
      replaceLineEnds(contents.valueOrPreset, separator.valueOrPreset)
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
        return entry.valueOrPreset;
      })
      .join("\n"),
    separator.valueOrPreset
  );
  setModifiedBy(source);
}

/** Sets the `src` of the given output to the file of the given entry. */
export function setSrc(output, entry) {
  const files = entry.valueOrPreset;
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
  output.element.style.setProperty(style, entry.valueOrPreset + suffix);
  setModifiedBy(entry);
}

/**
 * Sets the given style custom property of the application root element to the
 * value of the given entry and the given suffix. Notation and namespace
 * prefixes, and capitalizations are handled here.
 */
export function setStyleVariable(style, entry, suffix) {
  setStyle(
    getRoot(),
    "--" + CSS_NAMESPACE + style.charAt(0).toUpperCase() + style.substring(1),
    entry,
    suffix
  );
}

/** Resets the cover image. */
export function resetCover() {
  const entry = getDataEntry("coverImage");
  entry.value = NUL_STRING;
  getOutput("cover").element.src = COVER_IMAGE;
  setModifiedBy(entry);
}
