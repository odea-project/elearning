import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, HighlightStyle, StreamLanguage } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { tags } from "@lezer/highlight";
import { r } from "@codemirror/legacy-modes/mode/r";

// Basic setup as an array of extensions
const basicSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap,
    ...foldKeymap
  ])
];

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

// R language support
const rLang = StreamLanguage.define(r);

// Custom R theme and highlighting
const rHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: "#75715e", fontStyle: "italic" },
  { tag: tags.string, color: "#98C379" },
  { tag: tags.number, color: "#61AFEF" },
  { tag: tags.bool, color: "#FF1493" },
  { tag: tags.atom, color: "#FF1493" },
  { tag: tags.keyword, color: "#C678DD", fontWeight: "bold" },
  { tag: tags.variableName, color: "#E06C75" },
  { tag: tags.operator, color: "#56B6C2" },
  { tag: tags.paren, color: "#ABB2BF" },
  { tag: tags.bracket, color: "#ABB2BF" },
  { tag: tags.brace, color: "#ABB2BF" }
]);

const rTheme = EditorView.theme({
  "&": { color: "#ABB2BF", backgroundColor: "#282c34" },
  ".cm-content": { caretColor: "#528bff" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#528bff" },
  ".cm-selectionBackground, .cm-content ::selection": { backgroundColor: "#3e4451" },
  "&.cm-focused .cm-selectionBackground": { backgroundColor: "#3e4451" },
  ".cm-activeLine": { backgroundColor: "#2c313c" }
}, { dark: true });

const rLanguageSupport = [rLang, rTheme, syntaxHighlighting(rHighlightStyle)];

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
