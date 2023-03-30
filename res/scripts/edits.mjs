/**
 * J-Card Template: Edit Actions
 *
 * Functions modifying the current instance.
 */

import { NUL_STRING } from "./common/constants.mjs";
import { replaceLineEnds } from "./common/functions.mjs";

/**
 * Sets the back contents to the given output. This operates on one side only.
 */
export function setBackContents(output, label, contents, separator, shortBack) {
  output.element.innerHTML = contents.valueOrLkgOrPreset
    ? (shortBack.valueOrLkgOrPreset && label.valueOrLkgOrPreset
        ? '<span class="bold">' +
          label.valueOrLkgOrPreset +
          ":&nbsp;&nbsp;</span>"
        : NUL_STRING) +
      replaceLineEnds(contents.valueOrLkgOrPreset, separator.valueOrLkgOrPreset)
    : NUL_STRING;
  return true;
}

/** Sets the front contents to the given output. */
export function setFrontContents(output, aContents, bContents, separator) {
  output.element.innerHTML = replaceLineEnds(
    [aContents, bContents]
      .map((entry) => {
        return entry.valueOrLkgOrPreset;
      })
      .join("\n"),
    separator.valueOrLkgOrPreset
  );
  return true;
}
