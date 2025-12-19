import { extractDeps } from '../utils/component-md.mjs';

export function validateScssDeps(done) {
  if (!add.setings.validateScssDeps) {
    done();
    return;
  }

  const { fs, path, colors } = add.plugins;
  const componentsDir = add.paths.html.components;

  const graph = [];
  let hasErrors = false;

  const components = fs.readdirSync(componentsDir)
    .filter(name =>
      fs.statSync(path.join(componentsDir, name)).isDirectory()
    );

  components.forEach(component => {
    const componentPath = path.join(componentsDir, component);
    const scssFile = path.join(componentPath, `${component}.scss`);
    const mdFile = path.join(componentPath, `${component}.md`);

    if (!fs.existsSync(scssFile)) return;

    const scssContent = fs.readFileSync(scssFile, 'utf8');
    const scssUses = extractScssUses(scssContent);

    const mdDeps = fs.existsSync(mdFile)
      ? extractDeps(fs.readFileSync(mdFile, 'utf8'))
      : [];

    // SCSS → MD
    scssUses.forEach(dep => {
      if (!isComponentDep(dep, components)) {
        return; // ⬅ base / внешний scss — игнорируем
      }

      if (!mdDeps.includes(dep)) {
        console.log(
          colors.red(
            `✖ ${component}.scss: @use "${dep}" не описан в ${component}.md`
          )
        );
        hasErrors = true;
      }
    });


    // MD → SCSS
    mdDeps.forEach(dep => {
      if (!isComponentDep(dep, components)) return;

      if (!scssUses.includes(dep)) {
        console.log(
          colors.yellow(
            `⚠ ${component}: зависимость "${dep}" описана, но не подключена в SCSS`
          )
        );
      }
    });

    scssUses.forEach(dep => {
      if (isComponentDep(dep, components)) {
        graph.push([component, dep]);
      }
    });

  });

  if (hasErrors) {
    console.log(colors.red('\n✖ Проверка зависимостей SCSS завершилась неудачей\n'));
    process.exit(1);
  }

  if (add.setings.generateScssDepsGraph) {
    writeDotGraph(graph);
  }

  console.log(colors.green('✓ Зависимости SCSS правильные\n'));
  done();
}

// Парсер @use
function extractScssUses(content) {
  const uses = [];

  const regex = /@use\s+['"](.+?)['"]/g;
  let match;

  while ((match = regex.exec(content))) {
    const path = match[1];

    // ../icon/icon → icon
    const parts = path.split('/');
    uses.push(parts[parts.length - 1]);
  }

  return uses;
}

function isComponentDep(dep, components) {
  return components.includes(dep);
}

// Генерация.dot(Graphviz)
function writeDotGraph(edges) {
  const { fs, path } = add.plugins;

  const outFile = path.join(
    add.paths.dest,
    add.setings.scssDepsGraphFile
  );

  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const lines = [
    'digraph scss_deps {',
    '  rankdir=LR;'
  ];

  edges.forEach(([from, to]) => {
    lines.push(`  "${from}" -> "${to}";`);
  });

  lines.push('}');

  fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
}
