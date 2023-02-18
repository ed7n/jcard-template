/**
 * J-Card Template: Models
 *
 * Form and output model classes.
 */

import { NUL_ELEMENT, NUL_OBJECT, NUL_STRING } from "./constants.mjs";
import {
  qs,
  defaultOrAsIs,
  getInputSafeValue,
  setInputValue,
} from "./functions.mjs";
import { application, template } from "./roots.mjs";

/**
 *  Represents a form control. It must follow Unagi's hierarchy, in which it is
 *  contained in an `.input`, which itself is contained in a `.field`.
 */
class FormControl {
  constructor(options = NUL_OBJECT, prefix = NUL_STRING) {
    /** Element. */
    this.element = defaultOrAsIs(
      NUL_ELEMENT,
      qs(application, "#" + prefix + options.id)
    );
  }

  /** Returns its field. */
  get field() {
    return this.parent.parentElement;
  }

  /** Returns its labels. */
  get labels() {
    return this.element.labels;
  }

  /** Returns its parent. */
  get parent() {
    return this.element.parentElement;
  }
}

/** Represents a form button. */
export class FormButton extends FormControl {
  constructor(options = NUL_OBJECT) {
    super(options, "button-");
  }
}

/** Represents a form entry. */
export class FormEntry extends FormControl {
  constructor(options = NUL_OBJECT) {
    super(options, "input-");
    /** Default value. */
    this.preset = defaultOrAsIs(NUL_STRING, options.preset);
  }

  /** Returns its preset-default fail-safe value. */
  get safeValue() {
    return getInputSafeValue(this.element, this.preset);
  }

  /** Returns its fail-safe value. */
  get value() {
    return getInputSafeValue(this.element, NUL_STRING);
  }

  /** Sets its value. */
  set value(value) {
    return setInputValue(this.element, value);
  }
}

/** Represents a data form entry. */
export class DataFormEntry extends FormEntry {
  constructor(options = NUL_OBJECT) {
    super(options);
    /** Save? */
    this.save = defaultOrAsIs(true, options.save);
  }
}

/** Represents a J-card template output. */
export class JCardOutput {
  constructor(options = NUL_OBJECT) {
    /** Element. */
    this.element = options.class
      ? defaultOrAsIs(NUL_ELEMENT, qs(template, ".template-" + options.class))
      : template;
  }
}
