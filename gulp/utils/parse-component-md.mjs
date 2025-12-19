// Парсер component.md → meta
export function parseComponentMd(content) {
  const lines = content.split('\n');

  const meta = {
    deps: [],
    js: {}
  };

  let section = null;

  for (const line of lines) {
    const t = line.trim();

    if (t.startsWith('## ')) {
      section = t.slice(3);
      continue;
    }

    if (!t) continue;

    if (section === 'Зависимости' && t.startsWith('-')) {
      meta.deps.push(t.replace(/^-\s*/, ''));
    }

    if (section === 'JS' && t.includes(':')) {
      const [k, v] = t.replace('-', '').split(':').map(s => s.trim());
      meta.js[k] = v === 'true' ? true : v === 'false' ? false : v;
    }
  }

  return meta;
}
