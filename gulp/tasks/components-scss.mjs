// import fs from 'fs';
// import path from 'path';

export function generateComponentsScss(done) {
  const componentsDir = add.plugins.path.join(
    // add.paths.src,
    add.paths.html.components
  );

  const outFile = add.plugins.path.join(
    // add.paths.src,
    add.paths.scss.src,
    '_components.scss'
  );

  const imports = add.plugins.fs.readdirSync(componentsDir)
    .filter(name =>
      add.plugins.fs.existsSync(
        add.plugins.path.join(componentsDir, name, `${name}.scss`)
      )
    )
    .map(name =>
      `@use '../html/components/${name}/${name}';`
    )
    .join('\n');

  add.plugins.fs.writeFileSync(outFile, imports);
  done();
}
