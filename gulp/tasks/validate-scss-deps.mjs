export function validateScssDeps(done) {
  if (!add.setings.validateScssDeps) {
    done();
    return;
  }

  const { fs, path, colors } = add.plugins;

  const componentsDir = add.paths.html.components;
  const graph = {};
  let hasErrors = false;

  const componentNames = fs
    .readdirSync(componentsDir)
    .filter(name =>
      fs.statSync(path.join(componentsDir, name)).isDirectory()
    );

  const componentSet = new Set(componentNames);

  componentNames.forEach(component => {
    const scssFile = path.join(
      componentsDir,
      component,
      `${component}.scss`
    );

    if (!fs.existsSync(scssFile)) return;

    const content = fs.readFileSync(scssFile, 'utf8');

    const uses = [...content.matchAll(/@use\s+['"](.+?)['"]/g)]
      .map(m => m[1]);

    graph[component] = [];

    uses.forEach(usePath => {
      const parts = usePath.split('/');

      parts.forEach(part => {
        if (componentSet.has(part)) {
          graph[component].push(part);

          const msg = `SCSS dependency violation: ${component} → ${part}`;

          if (add.setings.scssDepsStrict) {
            console.log(colors.red(`✖ ${msg}`));
            hasErrors = true;
          } else {
            console.log(colors.yellow(`⚠ ${msg}`));
          }
        }
      });
    });
  });

  // 🔁 проверка циклов
  const visited = new Set();
  const stack = new Set();

  function dfs(node) {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const dep of graph[node] || []) {
      if (dfs(dep)) return true;
    }

    stack.delete(node);
    return false;
  }

  for (const node in graph) {
    if (dfs(node)) {
      console.log(colors.red(`✖ SCSS circular dependency detected at "${node}"`));
      hasErrors = true;
      break;
    }
  }

  if (hasErrors) {
    console.log(colors.red('\nSCSS dependency validation failed\n'));
    process.exit(1);
  }

  console.log(colors.green('\n✓ SCSS dependency graph is valid\n'));
  done();
}
