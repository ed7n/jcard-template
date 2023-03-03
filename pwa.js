/**
 * NET Self-service Worker by Brendon, 02/19/2023.
 *
 * Self-registering service worker for progressive web applications.
 *
 * Get your list of assets with:
 *
 * $ find . -type f -printf '  PATH_PAGE + "%P",'$'\n' | sort
 *
 * then modify it as needed.
 */

"use strict";

/** Page index path. */
const PATH_PAGE = "/jcard-template/";
/** Site resource path. */
const PATH_SITE = "https://ed7n.github.io/res/";
/** Name of the cache to operate on. */
const CACHE_NAME = "jcard-template-u1rF";
/** Request URLs whose response is to be cached. */
const CACHE_URLS = Object.freeze([
  PATH_PAGE + "",
  PATH_PAGE + "2",
  PATH_PAGE + "pwa",
  PATH_PAGE + "pwa.js",
  PATH_PAGE + "pwa.webmanifest",
  PATH_PAGE + "res/fonts/alte-haas-grotesk-bold.ttf",
  PATH_PAGE + "res/fonts/alte-haas-grotesk.ttf",
  PATH_PAGE + "res/media/cover.png",
  PATH_PAGE + "res/media/favicon-240.png",
  PATH_PAGE + "res/media/favicon.png",
  PATH_PAGE + "res/media/font-size-test.png",
  PATH_PAGE + "res/scripts/application-functions.mjs",
  PATH_PAGE + "res/scripts/application-model.mjs",
  PATH_PAGE + "res/scripts/constants.mjs",
  PATH_PAGE + "res/scripts/edits.mjs",
  PATH_PAGE + "res/scripts/events.mjs",
  PATH_PAGE + "res/scripts/functions.mjs",
  PATH_PAGE + "res/scripts/main.js",
  PATH_PAGE + "res/scripts/models.mjs",
  PATH_PAGE + "res/scripts/roots.mjs",
  PATH_PAGE + "res/scripts/start.mjs",
  PATH_PAGE + "res/scripts/views.mjs",
  PATH_PAGE + "res/styles/jcard.css",
  PATH_PAGE + "res/styles/view-1.css",
  PATH_PAGE + "res/styles/view.css",
  PATH_SITE + "media/pwa.png",
  PATH_SITE + "styles/application.css",
  PATH_SITE + "styles/base.css",
  PATH_SITE + "styles/document.css",
  PATH_SITE + "styles/form.css",
  PATH_SITE + "styles/header-footer.css",
  PATH_SITE + "styles/input.css",
  PATH_SITE + "styles/layout.css",
  PATH_SITE + "styles/nav.css",
]);

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
          .filter((key) => key !== CACHE_NAME)
          .forEach((key) => caches.delete(key));
      })
    );
  });
}
