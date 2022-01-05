// Interactive J-Card Template Logic.
const JCard = (() => {
  const NUL_STRING = "";
  const SPACE = " ";

  // Event: "change".
  const EVENT_CHANGE = Object.freeze(new Event("change"));
  // Event: "input".
  const EVENT_INPUT = Object.freeze(new Event("input"));
  // Default filename extension.
  const FILE_EXT = ".jcard.json";
  // Default filename.
  const FILE_NAME = "Unnamed J-Card";
  // Data file version.
  const FILE_VERSION = "0";
  // JSON MIME type.
  const MIME_JSON = "application/json";
  // Application root element.
  const root = document.querySelector("article");
  // Application actions.
  const actions = Object.freeze({
    load: new Action("button-load"),
    save: new Action("button-save"),
  });
  // Output clones.
  const clones = [];
  // Application inputs.
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
    outline: new Input("outline", false, false),
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
  // Application messages.
  const messages = Object.freeze({
    discard:
      "This will discard any unsaved changes made to the current J-card.",
    empty: "File is empty.",
    mime: "Wrong file MIME type:",
    nothing: "Nothing to load.",
  });
  // RegEx: End of line.
  const regexEol = new RegExp(/\s*(\n|\r\n|\r)\s*/g);
  // RegEx: JSON MIME type.
  const regexJson = new RegExp(/^(application\/json|text\/)/);
  // Data file download anchor.
  const anchor = document.createElement("a");
  // Text file reader.
  const reader = new FileReader();
  // Is the data modified?
  let modified;

  // Represents an input.
  function Input(id, value = NUL_STRING, save = true) {
    // Element.
    this.element = root.querySelector("#" + id);
    // Default value.
    this.value = value;
    // Save?
    this.save = save;
    return Object.freeze(this);
  }

  // Represents an action.
  function Action(id) {
    // Element.
    this.element = root.querySelector("#" + id);
    return Object.freeze(this);
  }

  // Initializes elements.
  function initialize(fields = {}) {
    let outputs = mapOutputs(qs(root, ".jcard-output > .template"));
    addOutputListeners(outputs);
    addSerializationListeners();
    addFormListeners();
    addWindowListeners();
    reader.onload = readData;
    populateInputs(fields);
    update();
    modified = false;
  }

  // Returns a map of output elements from the given template element.
  function mapOutputs(template) {
    let t = template;
    return {
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
      root: t,
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

  // Shorthand for `document.querySelector(query)`.
  function qs(document, query) {
    return document.querySelector(query);
  }

  // Adds listeners to inputs that update form fields, including themselves.
  function addFormListeners() {
    for (element of root.querySelectorAll(".card-text"))
      addStyleListener(inputs.fontFamily, element, "font-family");
  }

  // Adds listeners to the application window.
  function addWindowListeners() {
    addPrintListener();
    window.onbeforeunload = confirmExit;
  }

  // Adds listeners to inputs that update the J-card.
  function addOutputListeners(outputs) {
    let i = inputs,
      o = outputs;
    addImageListener(i.coverImage, o.coverImage);
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
    addStyleListener(i.backContentsAlignment, o.sideAContents, "text-align");
    addStyleListener(i.backContentsAlignment, o.sideALabel, "text-align");
    addStyleListener(i.backContentsAlignment, o.sideBContents, "text-align");
    addStyleListener(i.backContentsAlignment, o.sideBLabel, "text-align");
    addStyleListener(i.backSize, o.back, "font-size", "pt");
    addStyleListener(i.cardColor, o.boundaries, "background-color");
    addStyleListener(i.fontFamily, o.root, "font-family");
    addStyleListener(i.footerAlignment, o.footer, "text-align");
    addStyleListener(i.footerSize, o.footer, "font-size", "pt");
    addStyleListener(i.frontContentsAlignment, o.contents, "text-align");
    addStyleListener(i.frontSize, o.contents, "font-size", "pt");
    addStyleListener(i.frontTitleAlignment, o.frontTitleGroup, "text-align");
    addStyleListener(i.noteAlignment, o.noteGroup, "text-align");
    addStyleListener(i.noteSize, o.noteGroup, "font-size", "pt");
    addStyleListener(i.spineTitleAlignment, o.spineTitleGroup, "text-align");
    addStyleListener(i.textColor, o.root, "color");
    addStyleListener(i.titleLowerSize, o.frontTitleLower, "font-size", "pt");
    addStyleListener(i.titleLowerSize, o.spineTitleLower, "font-size", "pt");
    addStyleListener(i.titleUpperSize, o.frontTitleUpper, "font-size", "pt");
    addStyleListener(i.titleUpperSize, o.spineTitleUpper, "font-size", "pt");
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
    addToggleListener(
      i.frontContentsVisible,
      o.frontTitleGroup,
      "center",
      true
    );
    addToggleListener(i.frontTitleVisible, o.frontTitleGroup, "hidden", true);
    addToggleListener(i.italicize, o.root, "italicize");
    addToggleListener(i.outline, o.boundaries, "outline");
    addToggleListener(i.print2, o.root, "print-2");
    addToggleListener(i.shortBack, o.root, "short-back");
    addToggleListener(i.spineTitleVisible, o.spineTitleGroup, "hidden", true);
    addTracksListener(
      i.sideAContents,
      i.sideBContents,
      i.contentsSeparator,
      o.contents
    );
  }

  // Adds listeners to actions that invoke serialization tasks.
  function addSerializationListeners() {
    addSaveListener(actions.save.element);
    addLoadListener(actions.load.element);
  }

  /*
   * Sets the `src` property of the given output to the given input's file on
   * change.
   */
  function addImageListener(input, output) {
    input.element.addEventListener("change", () => {
      let file = input.element.files[0];
      if (file) {
        URL.revokeObjectURL(output.getAttribute("src"));
        output.setAttribute("src", URL.createObjectURL(file));
        if (input.save) modified = true;
      }
    });
  }

  /*
   * Sets the given output's `innerHTML` to the given inputs on change. This
   * one is specific to side labels, separators, and short back.
   */
  function addSideListener(label, contents, separator, shortBack, output) {
    let callback = () => {
      if (!contents.element.value) return (output.innerHTML = NUL_STRING);
      output.innerHTML =
        (shortBack.element.checked && label.element.value
          ? "<b>" + label.element.value + ":&nbsp;&nbsp;</b>"
          : NUL_STRING) +
        replaceLineEnds(contents.element.value, separator.element.value);
    };
    for (let input of [label, contents, separator, shortBack])
      input.element.addEventListener("input", () => {
        callback();
        if (input.save) modified = true;
      });
  }

  /*
   * Sets the given output's style property to the given input's value and
   * suffix on change.
   */
  function addStyleListener(input, output, property, suffix = NUL_STRING) {
    input.element.addEventListener("input", () => {
      if (input.save) modified = true;
      output.style[property] = input.element.value + suffix;
    });
  }

  // Copies the given input's value to the given output's `innerHTML` on change.
  function addTextListener(input, output) {
    input.element.addEventListener("input", () => {
      if (input.save) modified = true;
      output.innerHTML = input.element.value.replace(regexEol, "<br />");
    });
  }

  /*
   * Toggles the given class on the given output when the given input is
   * (un)checked.
   */
  function addToggleListener(input, output, toggleClass, invert = false) {
    input.element.addEventListener("change", () => {
      if (input.save) modified = true;
      if (input.element.checked ^ invert) output.classList.add(toggleClass);
      else output.classList.remove(toggleClass);
    });
  }

  /*
   * Sets the given output's `innerHTML` to the given inputs on change. This
   * one is specific to front contents.
   */
  function addTracksListener(aContents, bContents, separator, output) {
    let callback = () => {
      output.innerHTML = replaceLineEnds(
        joinStrings(
          [aContents, bContents].map((input) => {
            return input.element.value;
          })
        ),
        separator.element.value
      );
    };
    for (let input of [aContents, bContents, separator])
      input.element.addEventListener("input", () => {
        callback();
        if (input.save) modified = true;
      });
  }

  // Loads the load file when the given element is clicked.
  function addLoadListener(element) {
    element.addEventListener("click", () => {
      let files = inputs.loadFile.element.files;
      if (!files.length) return alert(messages.nothing);
      let file = files[0];
      if (!file.size) return alert(messages.empty);
      if (!regexJson.test(file.type))
        return alert(messages.mime + "\n\n" + file.type);
      if (!modified || confirm(messages.discard)) reader.readAsText(files[0]);
    });
  }

  // Clones the given root before printing and undoes after.
  function addPrintListener() {
    let output = qs(root, ".jcard-output");
    window.onbeforeprint = () => {
      if (inputs.print2.element.checked)
        clones.push(output.cloneNode((deep = true)));
      for (let clone of clones) output.parentElement.append(clone);
    };
    window.onafterprint = () => {
      for (let clone of clones) {
        clone.remove();
        clones.shift();
      }
    };
  }

  // Saves the inputs when the given element is clicked.
  function addSaveListener(element) {
    element.addEventListener("click", () => {
      let data = { version: FILE_VERSION };
      for (let [key, input] of Object.entries(inputs)) {
        if (!input.save) continue;
        let element = input.element;
        data[key] = element[element.type === "checkbox" ? "checked" : "value"];
      }
      let file = new File(
        [JSON.stringify(data)],
        data.titleUpper || data.titleLower || FILE_NAME,
        { type: MIME_JSON }
      );
      if (anchor.href) URL.revokeObjectURL(anchor.href);
      anchor.href = URL.createObjectURL(file);
      anchor.download = file.name + FILE_EXT;
      anchor.click();
    });
  }

  // Parses the read data into the inputs then updates them.
  function readData() {
    populateInputs(JSON.parse(reader.result));
    update();
    modified = false;
  }

  // Prompts to exit when there may be unsaved changes.
  function confirmExit(event) {
    if (!modified) return;
    event.preventDefault();
    event.returnValue = "Blink";
  }

  // Joins the given string array with a line feed (\n).
  function joinStrings(array) {
    return array.join("\n");
  }

  // Replaces line endings in the given string to the given separator.
  function replaceLineEnds(string, separator) {
    return string.replace(regexEol, separator);
  }

  // Populates the given input elements with the given field values.
  function populateInputs(fields) {
    for (key in inputs) {
      let input = inputs[key];
      if (!input.save) continue;
      let element = input.element;
      element[element.type === "checkbox" ? "checked" : "value"] =
        fields[key] !== undefined ? fields[key] : input.value;
    }
  }

  // Triggers listener calls on all inputs.
  function update() {
    for (key in inputs) {
      let element = inputs[key].element;
      element.dispatchEvent(
        element.type === "checkbox" || element.type === "file"
          ? EVENT_CHANGE
          : EVENT_INPUT
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
