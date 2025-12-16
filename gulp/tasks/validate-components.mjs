export function validateComponents(done) {

  if (!add.setings.validateComponents) {
    return done();
  }

  const { fs, path, colors } = add.plugins;

  const componentsDir = add.paths.html.components;

  const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  let hasErrors = false;

  fs.readdirSync(componentsDir).forEach(component => {
    const componentPath = path.join(componentsDir, component);

    if (!fs.statSync(componentPath).isDirectory()) return;

    console.log(colors.cyan(`• ${component}`));

    if (!kebabCase.test(component)) {
      console.log(colors.red(`  ├─ invalid component name`));
      hasErrors = true;
    }

    if (!fs.existsSync(path.join(componentPath, `${component}.html`))) {
      console.log(colors.red(`  ├─ missing ${component}.html`));
      hasErrors = true;
    }

    if (!fs.existsSync(path.join(componentPath, `${component}.scss`))) {
      console.log(colors.red(`  ├─ missing ${component}.scss`));
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.log(colors.red('\nComponent validation failed\n'));
    process.exit(1);
  }

  console.log(colors.green('\n✓ Components validated successfully\n'));
  done();
}

