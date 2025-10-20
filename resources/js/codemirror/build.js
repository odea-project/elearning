const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'main.js')],
  bundle: true,
  outfile: path.join(__dirname, 'assets', 'index-CI_ESZ2V.js'),
  format: 'iife',
  globalName: '__codemirror__',
  minify: false,
  sourcemap: false,
  platform: 'browser',
  target: ['es2020'],
}).then(() => {
  console.log('✓ CodeMirror build complete');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
