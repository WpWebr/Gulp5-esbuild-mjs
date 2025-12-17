import { extractUsedComponents } from './extract-used-components.mjs';

export function collectUsedComponents(htmlDir, fs, path) {
  const used = new Set();

  function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);

      if (fs.statSync(full).isDirectory()) {
        walk(full);
        return;
      }

      if (!file.endsWith('.html')) return;

      const content = fs.readFileSync(full, 'utf8');
      extractUsedComponents(content).forEach(c => used.add(c));
    });
  }

  walk(htmlDir);
  return used;
}
