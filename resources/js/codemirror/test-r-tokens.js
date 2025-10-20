const {r} = require('@codemirror/legacy-modes/mode/r');

const state = r.startState();
const testCases = [
  'mean', 'sum', 'sample', 'replicate',
  '5', '3.14',
  'TRUE', 'FALSE', 'NA', 'NULL',
  'if', 'else', 'function',
  'x', 'my_var',
  '# this is a comment',
  '"hello world"',
  '<-', '+', '*'
];

console.log('Testing R tokenizer:');
console.log('='.repeat(50));

testCases.forEach(code => {
  const stream = {
    string: code,
    pos: 0,
    start: 0,
    match: function(pattern) {
      const m = this.string.slice(this.pos).match(pattern);
      if (m && m.index === 0) {
        this.pos += m[0].length;
        return m[0];
      }
      return false;
    },
    next: function() { return this.string[this.pos++]; },
    skipToEnd: function() { this.pos = this.string.length; },
    sol: function() { return this.pos === 0; },
    peek: function() { return this.string[this.pos]; }
  };
  
  const result = r.token(stream, state);
  console.log(`${code.padEnd(20)} -> ${result || '(null)'}`);
});
