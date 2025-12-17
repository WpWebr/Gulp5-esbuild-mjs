export function extractDeps(content) {
  const lines = content.split('\n');
  let inDeps = false;
  const deps = [];

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      inDeps = trimmed === '## Зависимости';
      return;
    }

    if (!inDeps) return;

    if (trimmed.startsWith('-')) {
      deps.push(
        trimmed.replace(/^-\s*`?|`$/g, '')
      );
    }
  });

  return deps;
}
