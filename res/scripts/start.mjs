/**
 * J-Card Template: Start
 *
 * Start here.
 */

import { EVENT_CHANGE } from "./constants.mjs";
import { application } from "./application-model.mjs";
import {
  populate,
  update,
  setModified,
  getButton,
  getDataEntries,
  getLoadEntries,
  getPrintEntries,
  getSaveEntries,
  getViewEntries,
} from "./application-functions.mjs";
import { setupEvents } from "./events.mjs";

setupEvents();
Object.values(getDataEntries())
  .filter((entry) => !entry.save)
  .forEach((entry) => {
    entry.element.labels.forEach((label) => {
      label.innerHTML += "<sup>+</sup>";
    });
  });
[
  getDataEntries,
  getLoadEntries,
  getPrintEntries,
  getSaveEntries,
  getViewEntries,
].forEach((getter) => {
  const entries = Object.values(getter());
  entries
    .filter((entry) => entry.element.type === "number")
    .forEach((entry) => {
      entry.element.placeholder = entry.preset;
    });
  entries.forEach((entry) => {
    entry.value = entry.preset;
  });
});
[getLoadEntries, getPrintEntries, getSaveEntries].forEach((getter) => {
  Object.values(getter())
    .filter((entry) => entry.element.type === "checkbox")
    .forEach((entry) => {
      entry.element.dispatchEvent(EVENT_CHANGE);
    });
});
populate(
  {
    titleUpper: "The Numbers Game",
    titleLower: "Dark Mathematicians",
    footer: "Stereo Tape",
    noteUpper: "Recorded",
    noteLower: "August 2017",
    sideALabel: "Side A",
    sideAContents:
      "One of Us\nTwo is the Shoe\nThree for Me\nFour Out the Door",
    sideBLabel: "Side B",
    sideBContents:
      "Five is a Hive\nSix Movie Flicks\nSeven Ate Nine\nEight My Good Mate",
  },
  true
);
update();
getButton("resetCover").element.click();
setModified(false);

if (new URLSearchParams(location.search).has("debug")) {
  console.log(application);
}
