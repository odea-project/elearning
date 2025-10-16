import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "@codemirror/basic-setup";
import { python } from "@codemirror/lang-python";
import { StreamLanguage, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { HighlightStyle, tags } from "@lezer/highlight";
import { r } from "@codemirror/legacy-modes/mode/r";

const monokaiTheme = EditorView.theme(
  {
    "&": {
      color: "#f8f8f2",
      backgroundColor: "#272822"
    },
    ".cm-content": {
      caretColor: "#f8f8f0",
      backgroundColor: "#272822"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#f8f8f0"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#49483e"
    },
    ".cm-panels": {
      backgroundColor: "#272822",
      color: "#f8f8f2"
    },
    ".cm-activeLine": {
      backgroundColor: "#373831"
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#49483e",
      outline: "none"
    },
    "&.cm-editor": {
      borderRadius: "0.25rem"
    }
  },
  { dark: true }
);

const monokaiHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#f92672" },
  {
    tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
    color: "#a6e22e"
  },
  {
    tag: [tags.function(tags.variableName), tags.labelName],
    color: "#a6e22e"
  },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: "#66d9ef"
  },
  {
    tag: [tags.definition(tags.name), tags.separator],
    color: "#f8f8f2"
  },
  {
    tag: [tags.number, tags.changed, tags.modifier, tags.self, tags.namespace],
    color: "#ae81ff"
  },
  {
    tag: [tags.typeName, tags.className, tags.definition(tags.propertyName)],
    color: "#a6e22e"
  },
  {
    tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp],
    color: "#f92672"
  },
  {
    tag: [tags.tagName, tags.angleBracket],
    color: "#f92672"
  },
  {
    tag: tags.squareBracket,
    color: "#f8f8f2"
  },
  {
    tag: tags.attributeName,
    color: "#a6e22e"
  },
  {
    tag: [tags.comment, tags.meta, tags.quote],
    color: "#75715e"
  },
  {
    tag: tags.string,
    color: "#e6db74"
  },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  {
    tag: tags.invalid,
    color: "#f8f8f0",
    backgroundColor: "#f92672"
  }
]);

const monokai = [monokaiTheme, syntaxHighlighting(monokaiHighlightStyle)];

const rLanguageSupport = [StreamLanguage.define(r), syntaxHighlighting(defaultHighlightStyle)];

// Expose bundles on the window so existing code keeps working.
window.EditorView = EditorView;
window.EditorState = EditorState;
window.basicSetup = basicSetup;
window.python = python;
window.monokai = monokai;
window.rLanguageSupport = rLanguageSupport;

window.createPythonEditor = function (parent, doc) {
  return new EditorView({
    state: EditorState.create({
      doc: doc || "",
      extensions: [basicSetup, python(), monokai]
    }),
    parent
  });
};
