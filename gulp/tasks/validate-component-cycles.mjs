import { extractDeps } from '../utils/component-md.mjs';

// Построение графа
export function validateComponentCycles(done) {
  if (!add.setings.validateComponentCycles) {
    done();
    return;
  }

  const { fs, path, colors } = add.plugins;
  const componentsDir = add.paths.html.components;

  // 1. Собираем граф
  const graph = buildDepsGraph(componentsDir, fs, path);

  // 2. DFS
  const visited = new Map(); // white | gray | black
  let hasCycle = false;

  function dfs(node, stack = []) {
    visited.set(node, 'gray');
    stack.push(node);

    const deps = graph.get(node) || [];
    for (const dep of deps) {
      if (!visited.has(dep)) {
        dfs(dep, stack);
      } else if (visited.get(dep) === 'gray') {
        printCycle(stack, dep, colors);
        hasCycle = true;
        return;
      }
    }

    visited.set(node, 'black');
    stack.pop();
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  if (hasCycle) {
    console.log(colors.red('\n✖ Обнаружены циклические зависимости компонентов\n'));
    process.exit(1);
  }

  console.log(colors.green('✓ Отсутствие циклических зависимостей компонентов\n'));
  done();
}

// Красивый вывод цикла
function buildDepsGraph(componentsDir, fs, path) {
  const graph = new Map();

  const components = fs.readdirSync(componentsDir)
    .filter(name =>
      fs.statSync(path.join(componentsDir, name)).isDirectory()
    );

  components.forEach(name => {
    const mdFile = path.join(
      componentsDir,
      name,
      `${name}.md`
    );

    if (!fs.existsSync(mdFile)) {
      graph.set(name, []);
      return;
    }

    const content = fs.readFileSync(mdFile, 'utf8');
    const deps = extractDeps(content);

    graph.set(name, deps);
  });

  return graph;
}

function printCycle(stack, target, colors) {
  const cycleStart = stack.indexOf(target);
  const cycle = stack.slice(cycleStart).concat(target);

  console.log(
    colors.red('✖ Обнаружена циклическая зависимость:')
  );
  console.log(
    colors.yellow(
      '  ' + cycle.join(' → ')
    )
  );
}
