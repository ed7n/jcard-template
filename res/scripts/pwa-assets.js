/**
 * NET-Installer: Assets.
 *
 * Get your list of URLs with:
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
/** Request URLs whose response is to be cached. */
const CACHE_URLS = Object.freeze([
  PATH_PAGE + "",
  PATH_PAGE + "1",
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
  PATH_PAGE + "res/scripts/common/application-functions.mjs",
  PATH_PAGE + "res/scripts/common/constants.mjs",
  PATH_PAGE + "res/scripts/common/ecc.mjs",
  PATH_PAGE + "res/scripts/common/edits.mjs",
  PATH_PAGE + "res/scripts/common/events.mjs",
  PATH_PAGE + "res/scripts/common/functions.mjs",
  PATH_PAGE + "res/scripts/common/models.mjs",
  PATH_PAGE + "res/scripts/common/views.mjs",
  PATH_PAGE + "res/scripts/constants.mjs",
  PATH_PAGE + "res/scripts/edits.mjs",
  PATH_PAGE + "res/scripts/events.mjs",
  PATH_PAGE + "res/scripts/main.js",
  PATH_PAGE + "res/scripts/models.mjs",
  PATH_PAGE + "res/scripts/pwa-assets.js",
  PATH_PAGE + "res/scripts/roots.mjs",
  PATH_PAGE + "res/scripts/start.mjs",
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
