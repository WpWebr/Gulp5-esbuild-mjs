// // парсит комментарии компонентов и собирает документацию

export function generateComponentDocs(done) {
  if (!add.setings.generateComponentDocs) {
    done();
    return;
  }

  const { fs, path, colors } = add.plugins;

  const componentsDir = add.paths.html.components;
  const outFile = path.join(
    add.paths.dest,
    add.setings.componentDocsFile
  );

  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const docs = {};

  const componentDirs = fs.readdirSync(componentsDir)
    .filter(name =>
      fs.statSync(path.join(componentsDir, name)).isDirectory()
    );

  componentDirs.forEach(componentName => {
    const componentPath = path.join(componentsDir, componentName);
    const mdFile = path.join(componentPath, `${componentName}.md`);

    let description = 'нет описания';

    if (fs.existsSync(mdFile)) {
      const content = fs.readFileSync(mdFile, 'utf8');
      description = extractDescription(content, componentName);
    } else {
      console.log(
        colors.yellow(`⚠ ${componentName}: документация отсутствует`)
      );
    }

    const files = fs.readdirSync(componentPath);

    docs[componentName] = {
      description,
      documented: fs.existsSync(mdFile),
      files: {
        html: files.some(f => f.endsWith('.html')),
        scss: files.some(f => f.endsWith('.scss')),
        js: files.some(f => f.endsWith('.js')),
        md: fs.existsSync(mdFile)
      }
    };
  });

  fs.writeFileSync(outFile, JSON.stringify(docs, null, 2), 'utf8');

  console.log(
    colors.green(`✓ Документация по компоненту сгенерирована: ${outFile}\n`)
  );

  done();
}

// Парсер описания из
function extractDescription(content, componentName) {

  const lines = content.split('\n');
  const meta = {
    title: componentName,
    description: 'нет описания',
    mods: [],
    lazy: 'auto',
    data: [],
    deps: [],
    example: '',
    notes: '',
    documented: true
  };

  let section = null;
  let buffer = [];

  const flush = () => {
    if (!section) return;

    const text = buffer.join('\n').trim();

    switch (section) {
      case 'description':
        meta.description = text || meta.description;
        break;

      case 'mods':
        meta.mods = extractList(buffer);
        break;

      case 'lazy':
        meta.lazy = text || 'auto';
        break;

      case 'data':
        meta.data = extractList(buffer);
        break;

      case 'deps':
        meta.deps = extractList(buffer);
        break;

      case 'example':
        meta.example = stripCodeBlock(text);
        break;

      case 'notes':
        meta.notes = text;
        break;
    }

    buffer = [];
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      const title = trimmed.replace('# ', '');
      if (title !== componentName) {
        meta.documented = false;
      }
      section = 'description';
      return;
    }

    if (trimmed.startsWith('## ')) {
      flush();
      section = mapSection(trimmed.replace('## ', ''));
      return;
    }

    if (section) buffer.push(line);
  });

  flush();
  return meta;
}


function mapSection(title) {
  const map = {
    'Модификаторы': 'mods',
    'Lazy': 'lazy',
    'Data': 'data',
    'Зависимости': 'deps',
    'Пример': 'example',
    'Примечания': 'notes'
  };
  return map[title] || null;
}

function extractList(lines) {
  return lines
    .map(l => l.trim())
    .filter(l => l.startsWith('-'))
    .map(l => l.replace(/^-\s*`?|`$/g, ''));
}

function stripCodeBlock(text) {
  return text
    .replace(/```[\s\S]*?\n/, '')
    .replace(/```$/, '')
    .trim();
}
