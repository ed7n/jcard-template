/**
 * J-Card Template: Root Elements
 *
 * For internal use only.
 */

import { qs } from "./functions.mjs";

/** Application root element. */
export const application = qs(document, "article");
/** Template root element. */
export const template = qs(application, "#jcard > .template");
