import { extractDeps } from '../utils/component-md.mjs';

export function validateComponentDeps(done) {
  if (!add.setings.validateComponentDeps) {
    done();
    return;
  }

  const { fs, path, colors } = add.plugins;
  const componentsDir = add.paths.html.components;

  const componentNames = fs.readdirSync(componentsDir)
    .filter(name =>
      fs.statSync(path.join(componentsDir, name)).isDirectory()
    );

  const componentSet = new Set(componentNames);
  let hasErrors = false;

  componentNames.forEach(componentName => {
    const componentPath = path.join(componentsDir, componentName);
    const mdFile = path.join(componentPath, `${componentName}.md`);

    if (!fs.existsSync(mdFile)) return;

    const content = fs.readFileSync(mdFile, 'utf8');
    const deps = extractDeps(content);

    deps.forEach(dep => {
      if (!componentSet.has(dep)) {
        console.log(
          colors.red(
            `✖ ${componentName}: зависимость "${dep}" не найдена`
          )
        );
        hasErrors = true;
        return;
      }

      const depMd = path.join(
        componentsDir,
        dep,
        `${dep}.md`
      );

      if (!fs.existsSync(depMd)) {
        console.log(
          colors.yellow(
            `⚠ ${componentName}: "${dep}" существует, но без документации`
          )
        );
      }
    });
  });

  if (hasErrors) {
    console.log(
      colors.red('\nComponent dependency validation failed\n')
    );
    process.exit(1);
  }

  console.log(
    colors.green('✓ Component dependencies are valid\n')
  );

  done();
}
