// import fs from 'fs';
// import path from 'path';

export function generateComponentsJs(done) {
  const componentsDir = add.plugins.path.join(
    // add.paths.src,
    add.paths.html.components
  );

  const outFile = add.plugins.path.join(
    // add.paths.src,
    add.paths.scripts.js,
    'components.generated.js'
  );

  const imports = [];
  const inits = [];

  add.plugins.fs.readdirSync(componentsDir).forEach(component => {
    const jsFile = add.plugins.path.join(
      componentsDir,
      component,
      `${component}.js`
    );

    if (!add.plugins.fs.existsSync(jsFile)) return;

    const varName = `init_${component.replace(/-/g, '_')}`;
    const importPath = `../html/components/${component}/${component}.js`;

    imports.push(`import ${varName} from '${importPath}';`);

    inits.push(`
document.querySelectorAll('.${component}').forEach(el => {
  observeComponent(el, ${varName});
});
    `);
  });

  const content = `
import { observeComponent } from './utils/lazy-init.js';

${imports.join('\n')}

export function initComponents() {
${inits.join('\n')}
}
  `.trim();

  add.plugins.fs.writeFileSync(outFile, content);
  done();
}
