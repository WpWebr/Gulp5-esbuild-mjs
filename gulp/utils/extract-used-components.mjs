export function extractUsedComponents(htmlContent) {
  const used = new Set();

  const classRegex = /class\s*=\s*["']([^"']+)["']/g;
  let match;

  while ((match = classRegex.exec(htmlContent))) {
    match[1]
      .split(/\s+/)
      .forEach(cls => {
        const base = cls.split(/__|--/)[0];
        if (base) used.add(base);
      });
  }

  return used;
}
