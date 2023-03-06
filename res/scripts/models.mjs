/**
 * J-Card Template: Models
 *
 * Form and output model classes.
 */

import { template } from "./roots.mjs";
import { NUL_ELEMENT, NUL_OBJECT } from "./common/constants.mjs";
import { defaultOrAsIs, qs } from "./common/functions.mjs";
import { ElementModel } from "./common/models.mjs";

/** Represents a J-card template output. */
export class JCardOutput extends ElementModel {
  constructor(options = NUL_OBJECT, prefix = "template-") {
    super(
      options.class
        ? defaultOrAsIs(NUL_ELEMENT, qs(template, "." + prefix + options.class))
        : template,
      options
    );
  }
}
