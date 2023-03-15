/**
 * J-Card Template: Application Model
 *
 * Whenever available, use `application-functions` to operate on the model.
 */

import { FILE_NAME } from "./constants.mjs";
import { application as root } from "./roots.mjs";
import { JCardOutput } from "./models.mjs";
import { NUL_STRING } from "./common/constants.mjs";
import { qsAll } from "./common/functions.mjs";
import {
  DataFormEntry,
  ElementModel,
  FormButton,
  FormEntry,
} from "./common/models.mjs";

/** Application model. */
export const application = Object.freeze({
  /** Root element. */
  root: new ElementModel(root),
  /** Collapsible fieldsets. */
  accordions: Object.freeze(
    (() => {
      const out = [];
      qsAll(root, "details").forEach((element) =>
        out.push(new ElementModel(element))
      );
      return out;
    })()
  ),
  /** Form buttons. */
  buttons: Object.freeze({
    coverReset: new FormButton({ id: "cover-reset" }),
    load: new FormButton({ id: "load" }),
    print: new FormButton({ id: "print" }),
    save: new FormButton({ id: "save" }),
    saveCover: new FormButton({ id: "save-cover" }),
    viewCollapse: new FormButton({ id: "view-collapse" }),
    viewExpand: new FormButton({ id: "view-expand" }),
  }),
  /** Form entries. */
  entries: Object.freeze({
    application: Object.freeze({
      ecc: new FormEntry({
        id: "application-ecc",
        preset: false,
      }),
      fontSizeFactorInvert: new FormEntry({
        id: "application-font-size-factor-invert",
        preset: 1,
      }),
    }),
    /** Data. */
    data: Object.freeze({
      backContentsAlignment: new DataFormEntry({
        id: "back-contents-alignment",
        preset: "left",
      }),
      backContentsVisible: new DataFormEntry({
        id: "back-contents-visible",
        preset: true,
      }),
      backSize: new DataFormEntry({
        id: "back-size",
        preset: 8,
      }),
      bold: new DataFormEntry({
        id: "bold",
        preset: false,
      }),
      cardColor: new DataFormEntry({
        id: "card-color",
        preset: "#ffffff",
      }),
      contentsSeparator: new DataFormEntry({
        id: "contents-separator",
        preset: "&nbsp;• ",
      }),
      coverImage: new DataFormEntry({
        id: "cover-image",
        persistent: true,
        preset: NUL_STRING,
        save: false,
      }),
      coverHeightFactor: new DataFormEntry({
        id: "cover-height-factor",
        preset: 1,
      }),
      fillCover: new DataFormEntry({
        id: "fill-cover",
        preset: false,
      }),
      fontFamily: new DataFormEntry({
        id: "font-family",
        preset: "Alte Haas Grotesk",
      }),
      footer: new DataFormEntry({
        id: "footer",
        preset: NUL_STRING,
      }),
      footerAlignment: new DataFormEntry({
        id: "footer-alignment",
        preset: "center",
      }),
      footerSize: new DataFormEntry({
        id: "footer-size",
        preset: 10,
      }),
      forceCaps: new DataFormEntry({
        id: "force-caps",
        preset: true,
      }),
      frontContentsAlignment: new DataFormEntry({
        id: "front-contents-alignment",
        preset: "left",
      }),
      frontContentsVisible: new DataFormEntry({
        id: "front-contents-visible",
        preset: true,
      }),
      frontSize: new DataFormEntry({
        id: "front-size",
        preset: 9,
      }),
      frontTitleAlignment: new DataFormEntry({
        id: "front-title-alignment",
        preset: "center",
      }),
      frontTitleVisible: new DataFormEntry({
        id: "front-title-visible",
        preset: true,
      }),
      italicize: new DataFormEntry({
        id: "italicize",
        preset: false,
      }),
      noteAlignment: new DataFormEntry({
        id: "note-alignment",
        preset: "right",
      }),
      noteLower: new DataFormEntry({
        id: "note-lower",
        preset: NUL_STRING,
      }),
      noteSize: new DataFormEntry({
        id: "note-size",
        preset: 10,
      }),
      noteUpper: new DataFormEntry({
        id: "note-upper",
        preset: NUL_STRING,
      }),
      reverse: new DataFormEntry({
        id: "reverse",
        preset: false,
      }),
      shortBack: new DataFormEntry({
        id: "short-back",
        preset: false,
      }),
      shortSpine: new DataFormEntry({
        id: "short-spine",
        preset: false,
      }),
      sideAContents: new DataFormEntry({
        id: "side-a-contents",
        preset: NUL_STRING,
      }),
      sideALabel: new DataFormEntry({
        id: "side-a-label",
        preset: "Side A",
      }),
      sideBContents: new DataFormEntry({
        id: "side-b-contents",
        preset: NUL_STRING,
      }),
      sideBLabel: new DataFormEntry({
        id: "side-b-label",
        preset: "Side B",
      }),
      spineTitleAlignment: new DataFormEntry({
        id: "spine-title-alignment",
        preset: "left",
      }),
      spineTitleVisible: new DataFormEntry({
        id: "spine-title-visible",
        preset: true,
      }),
      textColor: new DataFormEntry({
        id: "text-color",
        preset: "#000000",
      }),
      titleLower: new DataFormEntry({
        id: "title-lower",
        preset: NUL_STRING,
      }),
      titleLowerSize: new DataFormEntry({
        id: "title-lower-size",
        preset: 12,
      }),
      titleUpper: new DataFormEntry({
        id: "title-upper",
        preset: NUL_STRING,
      }),
      titleUpperSize: new DataFormEntry({
        id: "title-upper-size",
        preset: 12,
      }),
    }),
    /** Load. */
    load: Object.freeze({
      cover: new FormEntry({
        id: "load-cover",
        preset: NUL_STRING,
      }),
    }),
    /** Print. */
    print: Object.freeze({
      count: new FormEntry({
        id: "print-count",
        preset: 1,
      }),
      margin: new FormEntry({
        id: "print-margin",
        preset: "half",
      }),
      opacity: new FormEntry({
        id: "print-opacity",
        preset: 1,
      }),
      outline: new DataFormEntry({
        id: "print-outline",
        preset: false,
      }),
      start: new FormEntry({
        id: "print-start",
        preset: 1,
      }),
    }),
    /** Save. */
    save: Object.freeze({
      follow: new FormEntry({
        id: "save-follow",
        preset: true,
      }),
      name: new FormEntry({
        id: "save-name",
        preset: FILE_NAME,
      }),
    }),
    /** View. */
    view: Object.freeze({
      forceDark: new FormEntry({
        id: "view-force-dark",
        preset: false,
      }),
      reverse: new FormEntry({
        id: "view-reverse",
        preset: false,
      }),
    }),
  }),
  /** J-card outputs. */
  outputs: Object.freeze({
    back: new JCardOutput({ class: "back" }),
    boundaries: new JCardOutput({ class: "boundaries" }),
    contents: new JCardOutput({ class: "contents" }),
    cover: new JCardOutput({ class: "cover" }),
    footer: new JCardOutput({ class: "footer" }),
    front: new JCardOutput({ class: "front" }),
    frontTitleGroup: new JCardOutput({ class: "front-title-group" }),
    frontTitleLower: new JCardOutput({ class: "front-title-lower" }),
    frontTitleUpper: new JCardOutput({ class: "front-title-upper" }),
    noteGroup: new JCardOutput({ class: "note-group" }),
    noteLower: new JCardOutput({ class: "note-lower" }),
    noteUpper: new JCardOutput({ class: "note-upper" }),
    root: new JCardOutput(),
    sideAContents: new JCardOutput({ class: "side-a-contents" }),
    sideALabel: new JCardOutput({ class: "side-a-label" }),
    sideBContents: new JCardOutput({ class: "side-b-contents" }),
    sideBLabel: new JCardOutput({ class: "side-b-label" }),
    spine: new JCardOutput({ class: "spine" }),
    spineTitleGroup: new JCardOutput({ class: "spine-title-group" }),
    spineTitleLower: new JCardOutput({ class: "spine-title-lower" }),
    spineTitleUpper: new JCardOutput({ class: "spine-title-upper" }),
  }),
  /** File download anchor. */
  anchor: document.createElement("a"),
  /** File reader. */
  reader: new FileReader(),
  /** Source file input. */
  source: new FormEntry({
    id: "load-file",
    preset: NUL_STRING,
  }),
  /** Current instance. */
  instance: Object.seal({
    file: null,
    modified: false,
  }),
});

if (new URLSearchParams(location.search).has("debug")) {
  console.log(application);
}
