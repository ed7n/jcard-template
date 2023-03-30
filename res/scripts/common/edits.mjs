/**
 * NET: Edit Actions
 *
 * Functions modifying the current instance.
 */

import { CSS_PREFIX } from "../constants.mjs";
import { NUL_STRING } from "./constants.mjs";
import { replaceLineEnds } from "./functions.mjs";
import { getRoot } from "./application-functions.mjs";

/**
 * Sets the boolean property given by its object and key to the value of the
 * given entry.
 */
export function setBooleanProperty(entry, object, key, invert = false) {
  object[key] = entry.valueOrLkgOrPreset ^ invert;
  return true;
}

/**
 * Sets the visibility of the given class word on the given output to the value
 * of the given entry.
 */
export function setClassWord(output, classs, entry, invert = false) {
  if (entry.valueOrLkgOrPreset ^ invert) {
    output.element.classList.add(classs);
  } else {
    output.element.classList.remove(classs);
  }
  return true;
}

/** Sets the inner HTML of the given output to the value of the given entry. */
export function setInnerHtml(output, entry) {
  output.element.innerHTML = replaceLineEnds(
    entry.valueOrLkgOrPreset,
    "<br />"
  );
  return true;
}

/** Sets the inner text of the given output to the value of the given entry. */
export function setInnerText(output, entry) {
  output.element.innerText = entry.valueOrLkgOrPreset;
  return true;
}

/**
 * Sets the property given by its object and key to the value of the given
 * entry.
 */
export function setProperty(entry, object, key) {
  object[key] = entry.valueOrLkgOrPreset;
  return true;
}

/** Sets the `src` of the given output to the file of the given entry. */
export function setSrc(output, entry) {
  const files = entry.valueOrLkgOrPreset;
  if (files.length) {
    const file = files[0];
    if (file) {
      const src = output.element.src;
      if (src) {
        URL.revokeObjectURL(src);
      }
      output.element.src = URL.createObjectURL(file);
      return true;
    }
  }
  return false;
}

/**
 * Sets the given style of the given output to the value of the given entry and
 * the given suffix.
 */
export function setStyle(output, style, entry, suffix = NUL_STRING) {
  output.element.style.setProperty(style, entry.valueOrLkgOrPreset + suffix);
  return true;
}

/**
 * Sets the given style custom property of the application root element to the
 * value of the given entry and the given suffix. Notation and namespace
 * prefixes, and capitalizations are handled here.
 */
export function setStyleVariable(style, entry, suffix = NUL_STRING) {
  return setStyle(
    getRoot(),
    "--" + CSS_PREFIX + style.charAt(0).toUpperCase() + style.substring(1),
    entry,
    suffix
  );
}
