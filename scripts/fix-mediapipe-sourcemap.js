// Fix missing sourcemap for @mediapipe/tasks-vision to silence CRA source-map-loader warning
// Creates an empty, valid .map file if it doesn't exist.

const fs = require('fs');
const path = require('path');

function ensureFile(filePath, contents) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, contents, 'utf-8');
    console.log(`[fix-mediapipe-sourcemap] Created: ${filePath}`);
  } else {
    console.log(`[fix-mediapipe-sourcemap] Exists: ${filePath}`);
  }
}

(function main() {
  try {
    const pkgDir = path.join(__dirname, '..', 'node_modules', '@mediapipe', 'tasks-vision');
    const targets = [
      path.join(pkgDir, 'vision_bundle_mjs.js.map'),
      // Some versions may reference different names; add more if needed
      path.join(pkgDir, 'vision_bundle.mjs.map'),
    ];

    const emptySourceMap = JSON.stringify({ version: 3, sources: [], names: [], mappings: '' }, null, 0);
    targets.forEach((t) => ensureFile(t, emptySourceMap));
  } catch (err) {
    console.error('[fix-mediapipe-sourcemap] Error:', err?.message || err);
    process.exitCode = 0; // avoid failing install
  }
})();
