/**
 * J-Card Template: Start
 *
 * Start here.
 */

import {
  populateDataSaves,
  getApplicationEntry,
  getDataEntries,
  getViewEntry,
} from "./application-functions.mjs";
import { setupEvents } from "./events.mjs";
import {
  reset,
  update,
  getButton,
  getEntries,
} from "./common/application-functions.mjs";
import { removeAnesthesia } from "./common/events.mjs";

const SUFFIX_LABEL = ":";
const SUFFIX_NOSAVE = "<sup>+</sup>";

const parameters = new URLSearchParams(location.search);

Object.values(getDataEntries())
  .filter((entry) => !entry.save)
  .forEach((entry) => {
    entry.element.labels.forEach((label) => {
      const index = label.innerHTML.lastIndexOf(SUFFIX_LABEL);
      if (index >= 0) {
        label.innerHTML =
          label.innerHTML.substring(0, index) +
          SUFFIX_NOSAVE +
          label.innerHTML.substring(index);
      } else {
        label.innerHTML += SUFFIX_NOSAVE;
      }
    });
  });
setupEvents();
Object.values(getEntries())
  .filter((entry) => entry.element.type === "number")
  .forEach((entry) => {
    entry.element.placeholder = entry.preset;
  });
reset();
populateDataSaves({
  titleUpper: "The Numbers Game",
  titleLower: "Dark Mathematicians",
  footer: "Stereo Tape",
  noteUpper: "Recorded",
  noteLower: "August 2017",
  sideALabel: "Side A",
  sideAContents: "One of Us\nTwo is the Shoe\nThree for Me\nFour Out the Door",
  sideBLabel: "Side B",
  sideBContents:
    "Five is a Hive\nSix Movie Flicks\nSeven Ate Nine\nEight My Good Mate",
});
if (parameters.has("dark")) {
  getViewEntry("forceDark").value = true;
}
if (parameters.has("ecc")) {
  getApplicationEntry("ecc").value = true;
}
update();
getButton("resetCover").element.click();
removeAnesthesia();
