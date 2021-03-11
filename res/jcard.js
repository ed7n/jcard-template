/*
 * Interactive J-Card Template Logic.
 */
const JCard = (() => {
  // Data file version.
  const VERSION = "0";
  // Event: "change".
  const CHANGE = Object.freeze(new Event("change"));
  // Event: "input".
  const INPUT = Object.freeze(new Event("input"));
  // Application root element.
  const root = document.getElementById("jcard");
  // Inputs.
  const inputs = Object.freeze({
    backContentsAlignment: new Input("back-contents-alignment", "left"),
    backSize: new Input("back-size", 8),
    bold: new Input("bold", false),
    cardColor: new Input("card-color", "#ffffff"),
    contentsSeparator: new Input("contents-separator", "&nbsp;• "),
    coverImage: new Input("cover-image", undefined, false),
    fillCover: new Input("fill-cover", false),
    fontFamily: new Input("font-family", "Alte Haas Grotesk"),
    footer: new Input("footer"),
    footerAlignment: new Input("footer-alignment", "center"),
    footerSize: new Input("footer-size", 10),
    forceCaps: new Input("force-caps", true),
    frontContentsAlignment: new Input("front-contents-alignment", "left"),
    frontContentsVisible: new Input("front-contents-visible", true),
    frontSize: new Input("front-size", 9),
    frontTitleAlignment: new Input("front-title-alignment", "center"),
    frontTitleVisible: new Input("front-title-visible", true),
    italicize: new Input("italicize", false),
    loadFile: new Input("load-file", undefined, false),
    noteAlignment: new Input("note-alignment", "right"),
    noteLower: new Input("note-lower"),
    noteSize: new Input("note-size", 10),
    noteUpper: new Input("note-upper"),
    print2: new Input("print-2", false),
    shortBack: new Input("short-back", false),
    sideAContents: new Input("side-a-contents"),
    sideALabel: new Input("side-a-label", "Side A"),
    sideBContents: new Input("side-b-contents"),
    sideBLabel: new Input("side-b-label", "Side B"),
    spineTitleAlignment: new Input("spine-title-alignment", "left"),
    spineTitleVisible: new Input("spine-title-visible", true),
    textColor: new Input("text-color", "#000000"),
    titleLower: new Input("title-lower"),
    titleLowerSize: new Input("title-lower-size", 12),
    titleUpper: new Input("title-upper"),
    titleUpperSize: new Input("title-upper-size", 12),
  });
  // Actions.
  const actions = Object.freeze({
    load: new Action("button-load"),
    save: new Action("button-save"),
  });
  // JSON MIME type.
  const mimeJson = new RegExp(/^(application\/json|text\/)/);
  // Line ending.
  const lineEnd = new RegExp(/\s*(\n|\r\n|\r)\s*/g);
  // Data file download anchor.
  const anchor = document.createElement("a");
  // Text file reader.
  const reader = new FileReader();
  // Is data modified?
  let modified;

  // Represents an input.
  function Input(id, value = "", save = true) {
    // Element.
    this.element = root.querySelector("#" + id);
    // Default value.
    this.value = value;
    // Include on save?
    this.save = save;
    return Object.freeze(this);
  }

  // Represents an action.
  function Action(id) {
    // Element.
    this.element = root.querySelector("#" + id);
    return Object.freeze(this);
  }

  /*
   * Initializes elements.
   */
  function initialize(fields = {}) {
    let previewTemplate = root.querySelector(".jcard-preview .template"),
      previewOutputs = mapOutputs(previewTemplate),
      dupeContainer = root.querySelector(".jcard-duplicate"),
      dupeTemplate = previewTemplate.cloneNode(true),
      dupeOutputs = mapOutputs(dupeTemplate);
    dupeContainer.appendChild(dupeTemplate);
    addToggleListeners();
    addJCardListeners(previewOutputs);
    addJCardListeners(dupeOutputs);
    addSerializationListeners();
    addControlListeners();
    reader.onload = readData;
    window.onbeforeunload = confirmExit;
    populateInputs(fields);
    update();
    modified = false;
  }

  /*
   * Returns a map of output elements from the given template element.
   */
  function mapOutputs(template) {
    let t = template;
    return {
      root: t,
      back: qs(t, ".template-back"),
      boundaries: qs(t, ".template-boundaries"),
      contents: qs(t, ".template-contents"),
      coverImage: qs(t, ".template-cover-image"),
      footer: qs(t, ".template-footer"),
      front: qs(t, ".template-front"),
      frontTitleGroup: qs(t, ".template-front-title-group"),
      frontTitleLower: qs(t, ".template-front-title-lower"),
      frontTitleUpper: qs(t, ".template-front-title-upper"),
      noteGroup: qs(t, ".template-note-group"),
      noteLower: qs(t, ".template-note-lower"),
      noteUpper: qs(t, ".template-note-upper"),
      sideAContents: qs(t, ".template-side-a-contents"),
      sideALabel: qs(t, ".template-side-a-label"),
      sideBContents: qs(t, ".template-side-b-contents"),
      sideBLabel: qs(t, ".template-side-b-label"),
      spine: qs(t, "template-spine"),
      spineTitleGroup: qs(t, ".template-spine-title-group"),
      spineTitleLower: qs(t, ".template-spine-title-lower"),
      spineTitleUpper: qs(t, ".template-spine-title-upper"),
    };
  }

  /*
   * Shorthand for `document.querySelector(query)`.
   */
  function qs(document, query) {
    return document.querySelector(query);
  }

  /*
   * Adds toggle listeners to inputs that toggle option classes.
   */
  function addToggleListeners() {
    addToggleListener(inputs.print2.element, root, "print-2");
  }

  /*
   * Adds style listeners to inputs that update controls, including themselves.
   */
  function addControlListeners() {
    for (element of root.querySelectorAll(".card-text"))
      addStyleListener(inputs.fontFamily.element, element, "fontFamily");
  }

  /*
   * Adds listeners to inputs that update j-card outputs.
   */
  function addJCardListeners(outputs) {
    let i = {},
      o = outputs;
    for (key in inputs) i[key] = inputs[key].element;
    addImageListener(i.coverImage, o.coverImage);
    addMarginListener(i.frontContentsVisible, o.frontTitleGroup);
    addSideListener(
      i.sideALabel,
      i.sideAContents,
      i.contentsSeparator,
      i.shortBack,
      o.sideAContents
    );
    addSideListener(
      i.sideBLabel,
      i.sideBContents,
      i.contentsSeparator,
      i.shortBack,
      o.sideBContents
    );
    addSizeListener(i.backSize, o.back);
    addSizeListener(i.footerSize, o.footer);
    addSizeListener(i.frontSize, o.contents);
    addSizeListener(i.noteSize, o.noteGroup);
    addSizeListener(i.titleLowerSize, o.frontTitleLower);
    addSizeListener(i.titleLowerSize, o.spineTitleLower);
    addSizeListener(i.titleUpperSize, o.frontTitleUpper);
    addSizeListener(i.titleUpperSize, o.spineTitleUpper);
    addStyleListener(i.backContentsAlignment, o.sideAContents, "textAlign");
    addStyleListener(i.backContentsAlignment, o.sideALabel, "textAlign");
    addStyleListener(i.backContentsAlignment, o.sideBContents, "textAlign");
    addStyleListener(i.backContentsAlignment, o.sideBLabel, "textAlign");
    addStyleListener(i.cardColor, o.boundaries, "backgroundColor");
    addStyleListener(i.fontFamily, o.root, "fontFamily");
    addStyleListener(i.footerAlignment, o.footer, "textAlign");
    addStyleListener(i.frontContentsAlignment, o.contents, "textAlign");
    addStyleListener(i.frontTitleAlignment, o.frontTitleGroup, "textAlign");
    addStyleListener(i.noteAlignment, o.noteGroup, "textAlign");
    addStyleListener(i.spineTitleAlignment, o.spineTitleGroup, "textAlign");
    addStyleListener(i.textColor, o.root, "color");
    addTextListener(i.footer, o.footer);
    addTextListener(i.noteLower, o.noteLower);
    addTextListener(i.noteUpper, o.noteUpper);
    addTextListener(i.sideALabel, o.sideALabel);
    addTextListener(i.sideBLabel, o.sideBLabel);
    addTextListener(i.titleLower, o.frontTitleLower);
    addTextListener(i.titleLower, o.spineTitleLower);
    addTextListener(i.titleUpper, o.frontTitleUpper);
    addTextListener(i.titleUpper, o.spineTitleUpper);
    addToggleListener(i.bold, o.root, "bold");
    addToggleListener(i.fillCover, o.coverImage, "fill");
    addToggleListener(i.forceCaps, o.root, "force-caps");
    addToggleListener(i.frontContentsVisible, o.contents, "hidden", true);
    addToggleListener(i.frontTitleVisible, o.frontTitleGroup, "hidden", true);
    addToggleListener(i.italicize, o.root, "italicize");
    addToggleListener(i.shortBack, o.root, "short-back");
    addToggleListener(i.spineTitleVisible, o.spineTitleGroup, "hidden", true);
    addTracksListener(
      i.sideAContents,
      i.sideBContents,
      i.contentsSeparator,
      o.contents
    );
  }

  /*
   * Adds listeners to actions that invoke serialization tasks.
   */
  function addSerializationListeners() {
    addSaveListener(actions.save.element);
    addLoadListener(actions.load.element);
  }

  /*
   * Sets the `src` property of the given output to the given input's file on
   * change.
   */
  function addImageListener(input, output) {
    input.addEventListener("change", () => {
      let file = input.files[0];
      if (file) {
        URL.revokeObjectURL(output.getAttribute("src"));
        output.setAttribute("src", URL.createObjectURL(file));
      }
    });
  }

  /*
   * Unsets the given output's top margin when the given input is checked.
   */
  function addMarginListener(input, output) {
    input.addEventListener("change", () => {
      modified = true;
      output.style["margin-top"] = input.checked ? "unset" : "0.4in";
    });
  }

  /*
   * Sets the given output's `innerHTML` to the given inputs on change. This
   * one is specific to side labels, separators, and short back.
   */
  function addSideListener(label, contents, separator, shortBack, output) {
    let callback = () => {
      modified = true;
      if (!contents.value) return (output.innerHTML = "");
      output.innerHTML =
        (shortBack.checked && label.value
          ? "<b>" + label.value + ":&nbsp;&nbsp;</b>"
          : "") + replaceLineEnds(contents.value, separator.value);
    };
    label.addEventListener("input", callback);
    contents.addEventListener("input", callback);
    separator.addEventListener("input", callback);
    shortBack.addEventListener("input", callback);
  }

  /*
   * Sets the given output's font size to the given input's value on change.
   */
  function addSizeListener(input, output) {
    input.addEventListener("input", () => {
      modified = true;
      output.style["font-size"] = input.value + "pt";
    });
  }

  /*
   * Sets the given output's style property to the given input's value on
   * change.
   */
  function addStyleListener(input, output, property) {
    input.addEventListener("input", () => {
      modified = true;
      output.style[property] = input.value;
    });
  }

  /*
   * Copies the given input's value to the given output's `innerHTML` on change.
   */
  function addTextListener(input, output) {
    input.addEventListener("input", () => {
      modified = true;
      output.innerHTML = input.value.replace(lineEnd, "<br />");
    });
  }

  /*
   * Toggles the given class on the given output when the given input is
   * (un)checked.
   */
  function addToggleListener(input, output, toggleClass, invert = false) {
    input.addEventListener("change", () => {
      modified = true;
      if (input.checked ^ invert) output.classList.add(toggleClass);
      else output.classList.remove(toggleClass);
    });
  }

  /*
   * Sets the given output's `innerHTML` to the given inputs on change. This
   * one is specific to front contents.
   */
  function addTracksListener(aContents, bContents, separator, output) {
    let callback = () => {
      modified = true;
      output.innerHTML = replaceLineEnds(
        joinStrings(
          [aContents, bContents].map((input) => {
            return input.value;
          })
        ),
        separator.value
      );
    };
    aContents.addEventListener("input", callback);
    bContents.addEventListener("input", callback);
    separator.addEventListener("input", callback);
  }

  /*
   * Loads the load file when the given element is clicked.
   */
  function addLoadListener(element) {
    element.addEventListener("click", () => {
      let files = inputs.loadFile.element.files;
      if (!files.length) return alert("Nothing to load.");
      let file = files[0];
      if (!file.size) return alert("File is empty.");
      if (!mimeJson.test(file.type))
        return alert("Wrong file MIME type:\n\n" + file.type);
      if (
        modified &&
        !confirm(
          "This will discard any unsaved changes made to the current J-card."
        )
      )
        return;
      reader.readAsText(files[0]);
    });
  }

  /*
   * Saves the inputs when the given element is clicked.
   */
  function addSaveListener(element) {
    element.addEventListener("click", () => {
      let data = { version: VERSION };
      for (key in inputs) {
        let input = inputs[key];
        if (!input.save) continue;
        let element = input.element;
        data[key] = element[element.type === "checkbox" ? "checked" : "value"];
      }
      let file = new File(
        [JSON.stringify(data)],
        data.titleUpper || data.titleLower || "Unnamed J-Card",
        { type: "application/json" }
      );
      if (anchor.href) URL.revokeObjectURL(anchor.href);
      anchor.href = URL.createObjectURL(file);
      anchor.download = file.name + ".jcard.json";
      anchor.click();
    });
  }

  /*
   * Parses the read data into the inputs then updates them.
   */
  function readData() {
    populateInputs(JSON.parse(reader.result));
    update();
    modified = false;
  }

  /*
   * Prompts to exit when there may be unsaved changes.
   */
  function confirmExit(event) {
    if (!modified) return;
    event.preventDefault();
    event.returnValue = "Blink";
  }

  /*
   * Joins the given string array with a line feed (\n).
   */
  function joinStrings(array) {
    return array.join("\n");
  }

  /*
   * Replaces line endings in the given string to the given separator.
   */
  function replaceLineEnds(string, separator) {
    return string.replace(lineEnd, separator);
  }

  /*
   * Populates the given input elements with the given field values.
   */
  function populateInputs(fields) {
    for (key in inputs) {
      let input = inputs[key];
      if (!input.save) continue;
      let element = input.element;
      element[element.type === "checkbox" ? "checked" : "value"] =
        fields[key] !== undefined ? fields[key] : input.value;
    }
  }

  /*
   * Triggers listener calls on all inputs.
   */
  function update() {
    for (key in inputs) {
      let element = inputs[key].element;
      element.dispatchEvent(
        element.type === "checkbox" || element.type === "file" ? CHANGE : INPUT
      );
    }
  }

  initialize({
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
  });
})();
