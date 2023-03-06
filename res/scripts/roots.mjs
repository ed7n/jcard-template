/**
 * J-Card Template: Root Elements
 *
 * For internal use only.
 */

import { qs } from "./common/functions.mjs";

/** Application root element. */
export const application = qs(document, "article");
/** Output root element. */
export const output = qs(application, "#output");
/** Template root element. */
export const template = qs(application, "#jcard > .template");
