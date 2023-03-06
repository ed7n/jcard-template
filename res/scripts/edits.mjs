/**
 * J-Card Template: Edit Actions
 *
 * Functions that the user invokes to edit the current instance.
 */

import { NUL_STRING } from "./common/constants.mjs";
import { replaceLineEnds } from "./common/functions.mjs";

/**
 * Sets the back contents to the given output. This operates on one side only.
 */
export function setBackContents(output, label, contents, separator, shortBack) {
  output.element.innerHTML = contents.valueOrPreset
    ? (shortBack.valueOrPreset && label.valueOrPreset
        ? '<span class="bold">' + label.valueOrPreset + ":&nbsp;&nbsp;</span>"
        : NUL_STRING) +
      replaceLineEnds(contents.valueOrPreset, separator.valueOrPreset)
    : NUL_STRING;
  return true;
}

/** Sets the front contents to the given output. */
export function setFrontContents(output, aContents, bContents, separator) {
  output.element.innerHTML = replaceLineEnds(
    [aContents, bContents]
      .map((entry) => {
        return entry.valueOrPreset;
      })
      .join("\n"),
    separator.valueOrPreset
  );
  return true;
}
