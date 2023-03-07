/**
 * NET: Event Condensing Coalescer (ECC)
 *
 * Condenses duplicate bursts events into one. A unique event registers itself
 * with its key and function application until it stops, then only the latest
 * one will be processed after a set timeout (`eccPeriod`).
 */

import { NUL_ARRAY, NUL_FUNCTION, NUL_STRING } from "./constants.mjs";

/** Bypass registrations? */
let eccBypass = true;
/** Registration timeout in milliseconds. */
let eccPeriod = 400;
/** Function application registrar. */
let eccRegistrar = new Map();
/** Retain registrations after processing? */
let eccRetain = false;

/** Cancels all pending applications. */
export function drain() {
  eccRegistrar.forEach((registration) => {
    clearTimeout(registration.timeout);
  });
  if (!isRetain()) {
    eccRegistrar.clear();
  }
}

/** Processes all pending applications. */
export function flush() {
  eccRegistrar.forEach((registration) => {
    if (registration.timeout > 0) {
      clearTimeout(registration.timeout);
      registration.handle();
    }
  });
}

/**
 * Applies the given function by its key then--if configured--delete its
 * registration.
 */
export function process(key) {
  const registration = eccRegistrar.get(key);
  registration.function.apply(null, registration.arguments);
  if (isRetain()) {
    registration.timeout = 0;
  } else {
    eccRegistrar.delete(key);
  }
}

/**
 * Registers the given key and function application into the registrar. If ECC
 * is disabled, then instead it applies the function and returns its return
 * value.
 */
export function register(
  key = NUL_STRING,
  functionn = NUL_FUNCTION,
  argumentss = NUL_ARRAY
) {
  if (isBypass()) {
    return functionn.apply(null, argumentss);
  } else {
    let registration;
    if (eccRegistrar.has(key)) {
      registration = eccRegistrar.get(key);
      clearTimeout(registration.timeout);
    } else {
      registration = Object.seal({
        handle: () => process(key),
        timeout: 0,
        function: functionn,
        arguments: argumentss,
      });
      eccRegistrar.set(key, registration);
    }
    registration.timeout = setTimeout(registration.handle, getPeriod());
  }
}

/** Returns whether registrations are bypassed. */
export function isBypass() {
  return eccBypass;
}

/**
 * Sets whether registrations are bypassed. Bypass enables should be followed by
 * `flush`.
 */
export function setBypass(bypass = true) {
  return (eccBypass = bypass);
}

/** Returns the registration timeout in milliseconds. */
export function getPeriod() {
  return eccPeriod;
}

/** Sets the registration timeout in milliseconds. */
export function setPeriod(period = 400) {
  return (eccPeriod = Math.abs(period));
}

/** Returns whether registrations are retained after processing. */
export function isRetain() {
  return eccRetain;
}

/** Sets whether registrations are retained after processing. */
export function setRetain(retain = false) {
  return (eccRetain = retain);
}
