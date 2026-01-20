import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, HighlightStyle, StreamLanguage } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { tags } from "@lezer/highlight";
import { r as rBase } from "@codemirror/legacy-modes/mode/r";

// Extended R mode with more built-in functions
const extendedBuiltins = [
  // Base R functions
  "c", "list", "vector", "matrix", "array", "data.frame", "factor",
  // Math functions
  "abs", "sign", "sqrt", "ceiling", "floor", "trunc", "round", "signif",
  "exp", "log", "log10", "log2", "cos", "sin", "tan", "acos", "asin", "atan", "atan2",
  // Statistical functions
  "mean", "median", "sum", "prod", "min", "max", "range", "var", "sd", "cov", "cor",
  "quantile", "IQR", "mad",
  // Sampling and distributions
  "sample", "replicate", "rnorm", "runif", "rbinom", "rpois", "rexp", "rgamma",
  "dnorm", "pnorm", "qnorm", "dbinom", "pbinom", "qbinom",
  // Data manipulation
  "subset", "merge", "aggregate", "transform", "within",
  "rbind", "cbind", "t", "apply", "lapply", "sapply", "tapply", "mapply",
  "sort", "order", "rank", "unique", "duplicated", "rev",
  // Logical and comparison
  "which", "ifelse", "all", "any", "identical",
  // NA handling
  "is.na", "na.omit", "complete.cases", "na.exclude",
  // Type checking and conversion
  "is.numeric", "is.character", "is.logical", "is.factor", "is.matrix", "is.data.frame",
  "as.numeric", "as.character", "as.logical", "as.factor", "as.matrix", "as.data.frame",
  // String functions
  "paste", "paste0", "cat", "print", "sprintf", "substr", "substring", "strsplit",
  "grep", "grepl", "sub", "gsub", "toupper", "tolower",
  // I/O functions
  "read.csv", "read.table", "write.csv", "write.table", "readLines", "writeLines",
  "load", "save", "source",
  // Plotting functions
  "plot", "points", "lines", "abline", "curve", "hist", "boxplot", "barplot",
  "pie", "dotchart", "matplot", "pairs",
  "par", "layout", "legend", "title", "axis", "mtext",
  // Inspection functions
  "str", "summary", "head", "tail", "names", "colnames", "rownames",
  "length", "dim", "nrow", "ncol", "class", "typeof", "mode",
  // Sequence generation
  "seq", "seq_len", "seq_along", "rep", "rep_len",
  // Package management
  "library", "require", "install.packages", "update.packages",
  // Other common functions
  "table", "cut", "findInterval", "approx", "spline",
  "lm", "glm", "anova", "predict", "residuals", "fitted",
  "eigen", "svd", "qr", "chol", "solve", "det", "diag"
];

const builtinSet = new Set(extendedBuiltins);

// Create extended R mode
const rExtended = {
  name: "r-extended",
  startState: rBase.startState,
  copyState: rBase.copyState,
  indent: rBase.indent,
  electricInput: rBase.electricInput,
  token: function(stream, state) {
    // First try the base R tokenizer
    const style = rBase.token(stream, state);
    
    // If it's a variable, check if it's in our builtin list
    if (style === "variable" || style === "variableName") {
      const word = stream.current();
      if (builtinSet.has(word)) {
        return "builtin";
      }
    }
    
    return style;
  }
};

const rLang = StreamLanguage.define(rExtended);
const jsonMode = {
  name: "json",
  startState: () => ({}),
  token: (stream) => {
    if (stream.eatSpace()) {
      return null;
    }

    const ch = stream.peek();
    if (ch === "\"") {
      stream.next();
      let escaped = false;
      while (!stream.eol()) {
        const next = stream.next();
        if (next === "\"" && !escaped) {
          break;
        }
        escaped = !escaped && next === "\\";
      }
      return "string";
    }

    if (stream.match(/-?\d+(\.\d+)?([eE][+-]?\d+)?/)) {
      return "number";
    }

    if (stream.match(/true|false|null/)) {
      return "atom";
    }

    if (stream.match(/[{}\[\],:]/)) {
      return "punctuation";
    }

    stream.next();
    return null;
  }
};
const jsonLang = StreamLanguage.define(jsonMode);
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

// Custom R theme and highlighting
// StreamLanguage maps "builtin" token to tags.standard(tags.variableName)
const rHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: "#75715e", fontStyle: "italic" },
  { tag: tags.string, color: "#98C379" },
  { tag: tags.number, color: "#61AFEF" },
  { tag: tags.bool, color: "#FF1493" },
  { tag: tags.atom, color: "#FF1493" },
  { tag: tags.keyword, color: "#C678DD", fontWeight: "bold" },
  { tag: tags.standard(tags.variableName), color: "#E5C07B", fontWeight: "bold" },  // Built-in functions
  { tag: tags.variableName, color: "#E06C75" },
  { tag: tags.operator, color: "#56B6C2" },
  { tag: tags.punctuation, color: "#ABB2BF" }
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
window.jsonLanguageSupport = jsonLang;

window.createPythonEditor = function (parent, doc) {
  return new EditorView({
    state: EditorState.create({
      doc: doc || "",
      extensions: [basicSetup, python(), monokai]
    }),
    parent
  });
};
