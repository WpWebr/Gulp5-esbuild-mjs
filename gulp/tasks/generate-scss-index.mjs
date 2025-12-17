import { extractDeps } from '../utils/component-md.mjs';
import { collectUsedComponents } from '../utils/collect-used-components.mjs';
import { expandWithDeps } from '../utils/expand-with-deps.mjs';

export function generateScssIndex(done) {
  if (!add.setings.generateScssIndex) {
    done();
    return;
  }

  const { fs, path, colors } = add.plugins;
  const componentsDir = add.paths.html.components;

  // 1. Строим deps-граф
  const graph = new Map();
  const hasScss = new Set();

  const components = fs.readdirSync(componentsDir)
    .filter(n =>
      fs.statSync(path.join(componentsDir, n)).isDirectory()
    );

  components.forEach(name => {
    const md = path.join(componentsDir, name, `${name}.md`);
    const scss = path.join(componentsDir, name, `${name}.scss`);

    graph.set(
      name,
      fs.existsSync(md)
        ? extractDeps(fs.readFileSync(md, 'utf8'))
        : []
    );

    if (fs.existsSync(scss)) hasScss.add(name);
  });

  // 2. Компоненты, реально используемые в HTML
  const used = collectUsedComponents(
    add.paths.html.components,
    fs,
    path
  );

  // 3. Расширяем через deps
  const required = expandWithDeps(used, graph);

  // 4. Топо-сортировка
  const order = topoSort(graph).filter(c => required.has(c));

  // 5. Генерация index.scss
  const lines = [
    '/* AUTO-GENERATED FILE */',
    '/* SMART SCSS BUILD */',
    ''
  ];

  order.forEach(name => {
    if (!hasScss.has(name)) return;

    const scssPath = path
      .relative(
        path.dirname(add.paths.styles.index),
        path.join(componentsDir, name, `${name}`)
      )
      .replace(/\\/g, '/');

    lines.push(`@use "${scssPath}";`);
  });

  fs.writeFileSync(add.paths.styles.index, lines.join('\n'), 'utf8');

  console.log(
    colors.green(
      `✓ SCSS index.scss generated (${required.size} components)`
    )
  );

  done();
}

function topoSort(graph) {
  const visited = new Set();
  const result = [];

  function visit(node) {
    if (visited.has(node)) return;
    visited.add(node);

    (graph.get(node) || []).forEach(visit);
    result.push(node);
  }

  graph.forEach((_, node) => visit(node));

  return result;
}
