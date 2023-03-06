/**
 * NET: View Actions
 *
 * Functions that modify the view.
 */

import { getAccordions } from "./application-functions.mjs";

/** Closes collapsible fieldsets. */
export function collapseAll() {
  return getAccordions().forEach((accordion) => {
    accordion.element.open = false;
  });
}

/** Opens collapsible fieldsets. */
export function expandAll() {
  return getAccordions().forEach((accordion) => {
    accordion.element.open = true;
  });
}

/** Sets whether the force dark body flag is enabled. */
export function setForceDark(dark = true) {
  dark
    ? document.body.classList.add("dark")
    : document.body.classList.remove("dark");
}
