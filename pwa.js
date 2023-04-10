/**
 * NET-Installer: Self-service Worker.
 *
 * Self-registering service worker for progressive web applications. It requires
 * the assets attachment to work.
 */

"use strict";

/** Assets attachment path. */
const PATH_ASSETS = "res/scripts/pwa-assets.js";
/** Cache base name. Do not change this. */
const CACHE_BASE = "jcard-template";
/** Cache unique identification. Change this on versioning. */
const CACHE_UNID = "u2r4-1";
/** Name of the cache to operate on. */
const CACHE_NAME = CACHE_BASE + "_" + CACHE_UNID;

if (self.toString().includes("Window")) {
  const action = document.querySelector("#action");
  const status = document.querySelector("#status");
  const string = document.querySelector("#string");
  const container = navigator.serviceWorker;

  async function register() {
    try {
      action.disabled = true;
      action.removeEventListener("click", register);
      status.innerHTML = "Registering…";
      await container.register("pwa.js");
      status.innerHTML = "Done.";
    } catch (error) {
      status.innerHTML = error;
    }
  }

  async function unregister() {
    if (confirm("This may remove offline access to the application.")) {
      try {
        action.disabled = true;
        action.removeEventListener("click", unregister);
        status.innerHTML = "Unregistering…";
        await container
          .getRegistration()
          .then((registration) => registration.unregister());
        status.innerHTML = "Deleting cache…";
        await caches.delete(CACHE_NAME);
        status.innerHTML = "Done.";
      } catch (error) {
        status.innerHTML = error;
      }
    }
  }

  string.innerHTML = CACHE_NAME;
  if (container) {
    if (container.controller) {
      action.addEventListener("click", unregister);
      action.innerHTML = "Unregister";
      status.innerHTML = container.controller.state;
    } else {
      action.addEventListener("click", register);
      action.innerHTML = "Register";
      status.innerHTML = "Normal.";
    }
    action.innerHTML += " Service Worker";
    action.disabled = false;
  } else {
    action.innerHTML = "Unavailable";
    action.disabled = true;
    status.innerHTML = "(" + String(container) + ")";
  }
} else if (self.toString().includes("ServiceWorkerGlobalScope")) {
  importScripts(PATH_ASSETS);
  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        await caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS));
      })()
    );
  });
  self.addEventListener("fetch", (event) => {
    const request = event.request;
    event.respondWith(
      (async () => {
        return (
          (await caches.match(request)) ||
          (await fetch(request).then(async (response) => {
            if (response.ok) {
              await caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, response.clone()));
            }
            return response;
          }))
        );
      })()
    );
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        keys
          .filter(
            (key) => key.startsWith(CACHE_BASE) && !key.endsWith(CACHE_UNID)
          )
          .forEach((key) => caches.delete(key));
      })
    );
  });
}
