/**
 * J-Card Template: Application Model
 *
 * Whenever available, use `application-functions` to operate on the model.
 */

import { NUL_STRING, FILE_NAME } from "./constants.mjs";
import { qsAll } from "./functions.mjs";
import { application as root } from "./roots.mjs";
import {
  DataFormEntry,
  FormButton,
  FormEntry,
  JCardOutput,
} from "./models.mjs";

/** Application model. */
export const application = Object.freeze({
  /** Root element. */
  root: root,
  /** Collapsible fieldsets. */
  accordions: qsAll(root, "details"),
  /** Form buttons. */
  buttons: Object.freeze({
    load: new FormButton({ id: "load" }),
    print: new FormButton({ id: "print" }),
    resetCover: new FormButton({ id: "reset-cover" }),
    save: new FormButton({ id: "save" }),
    saveCover: new FormButton({ id: "save-cover" }),
    viewCollapse: new FormButton({ id: "view-collapse" }),
    viewExpand: new FormButton({ id: "view-expand" }),
  }),
  /** Form entries. */
  entries: Object.freeze({
    /** Data. */
    data: Object.freeze({
      backContentsAlignment: new DataFormEntry({
        id: "back-contents-alignment",
        preset: "left",
      }),
      backContentsVisible: new DataFormEntry({
        id: "back-contents-visible",
        preset: true,
        save: true,
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
        preset: NUL_STRING,
        save: false,
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
      print2: new DataFormEntry({
        id: "print-2",
        preset: false,
      }),
      reverse: new DataFormEntry({
        id: "reverse",
        preset: false,
        save: true,
      }),
      shortBack: new DataFormEntry({
        id: "short-back",
        preset: false,
      }),
      shortSpine: new DataFormEntry({
        id: "short-spine",
        preset: false,
        save: true,
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
      file: new FormEntry({
        id: "load-file",
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
  /** Current instance. */
  instance: Object.seal({
    modified: false,
  }),
});
