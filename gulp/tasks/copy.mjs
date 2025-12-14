import { plugins } from '../config/plugins.mjs';

// Копирование файлов без изменений (files,inc)
export function copyFiles(done) {

  const nameFolders = add.setings.copyAll; // ['file', 'inc'] - папки преносимые с исходников (src) без изменения

  if (nameFolders) {
    nameFolders.forEach(el => {

      const incFolder = `${add.paths.src}/${el}/`; // папка исходников
      const incFiles = `${add.paths.src}/${el}/**/*`; // исходники (файлы)
      const incDest = `${add.paths.dest}/${el}/`; // папка назначения (куда)
      if (add.plugins.fs.existsSync(incFolder)) {
        return add.plugins.gulp.src(incFiles, { encoding: false })
          .pipe(add.handleError('CopyFiles'))
          .pipe(add.plugins.gulp.dest(incDest));
      } else {
        add.plumberError(`Папка ${incFolder} не найдена`);
      }

    });

  }

  done();
}

// Копирование PHP-файлов и добавление index.php в папки с PHP файлами

// Рекурсивный поиск PHP-файлов через Node.js
async function findPhpFiles(dir) {
  let result = [];

  const entries = await add.plugins.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = add.plugins.path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Обходим вложенную папку
      result = result.concat(await findPhpFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.php')) {
      result.push(fullPath);
    }
  }

  return result;
}

export async function copyPhp() {

  if (!add.setings.copyPHP) {
    console.log('Задача copyPhp отключена через флаг в setings.mjs');
    return;
  }

  const srcDir = add.paths.src;   // абсолютный или относительный путь
  const destDir = add.paths.dest; // абсолютный или относительный

  // 1. Ищем .php вручную (без glob)
  const phpFiles = await findPhpFiles(srcDir);

  if (phpFiles.length === 0) {
    console.log('Нет PHP-файлов для копирования.');
    return;
  }

  // 2. Получаем список директорий, где есть .php
  const phpDirs = [...new Set(
    phpFiles.map(p => add.plugins.path.dirname(p))
  )];

  // 3. Копируем PHP (Gulp автоматически создаёт папки)
  await new Promise(resolve => {
    add.plugins.gulp.src(add.plugins.path.join(srcDir, '**/*.php'), { base: srcDir })
      .pipe(add.plugins.gulp.dest(destDir))
      .on('end', resolve);
  });

  // 4. Создаём index.php (только если его нет)
  const indexContent = `<?php
// Silence is golden.
`;

  for (const phpDir of phpDirs) {

    // Строим путь относительно src
    const relative = add.plugins.path.relative(srcDir, phpDir);

    // Путь в dist
    const finalDir = add.plugins.path.join(destDir, relative);
    const indexPath = add.plugins.path.join(finalDir, 'index.php');

    try {
      await add.plugins.access(indexPath); // файл существует
      continue;
    } catch {
      // Файл НЕ существует → создаём
      await add.plugins.mkdir(finalDir, { recursive: true });
      await add.plugins.writeFile(indexPath, indexContent);
      console.log('Создан:', indexPath);
    }
  }

  console.log('PHP файлы скопированы, index.php добавлены в папки с PHP файлами.');
}

// Копирование robots.txt
export function copyRobots() {
  return add.plugins.gulp.src(add.paths.robots.src)
    .pipe(add.handleError('copyRobots'))
    .pipe(add.plugins.gulp.dest(add.paths.dest));
}

// Копирование GIF-файлов без изменений
export function gifs() {
  return add.plugins.gulp.src(add.paths.gifs.src, { encoding: false })
    .pipe(add.handleError('GIFs'))
    .pipe(add.plugins.gulp.dest(add.paths.gifs.dest));
}

// Копирование SVG-файлов без изменений
export function copySvg(done) {
  const svgFiles = add.paths.svg.src;
  if (add.plugins.fs.existsSync(add.paths.svg.srcFolder)) {
    return add.plugins.gulp.src(svgFiles, { encoding: false })
      .pipe(add.handleError('CopySvg'))
      .pipe(add.plugins.gulp.dest(add.paths.svg.dest));
  } else {
    add.plumberError(`Папка ${add.paths.svg.srcFolder} не найдена`);
  }
  done();
}

// Копируем шрифты
export function copyFonsts() {
  // ищем файлы шрифтов .woff и .woff2
  return add.plugins.gulp.src(`${add.paths.fonts.src_woff}/*{.woff,.woff2}`, { encoding: false })
    .pipe(add.plugins.newer(add.paths.fonts.dest))
    // выгружаем в папку с результатом
    .pipe(add.plugins.gulp.dest(add.paths.fonts.dest));
}

// Копирование обработанных изображений из src/img и src/img_min в dist/images
export const copyProcessedImages = plugins.gulp.series(copyImg, copyImgMin);

function copyImg() {
  return add.plugins.gulp.src(add.paths.images.srcDest, { encoding: false })
    .pipe(add.handleError('CopyProcessedImages'))
    .pipe(add.plugins.newer(add.paths.images.dest))
    .pipe(add.plugins.gulp.dest(add.paths.images.dest));
}
function copyImgMin() {
  return add.plugins.gulp.src(add.paths.images.imgMinSrc, { encoding: false })
    .pipe(add.handleError('CopyProcessedImages'))
    .pipe(add.plugins.newer(add.paths.images.dest))
    .pipe(add.plugins.gulp.dest(add.paths.images.dest));
}

// Копирование спрайта в dist
export function copySvgSprite(done) {

  if (add.setings.sprite) {
    // Создание папки src/images/sprite, если её нет
    if (!add.plugins.fs.existsSync(add.paths.svg.spriteDest)) {
      add.plugins.mkdir(add.paths.svg.spriteDest, { recursive: true });
    }

    const spriteFile = add.paths.svg.sprite;

    if (add.plugins.fs.existsSync(spriteFile)) {
      return add.plugins.gulp.src(spriteFile, { encoding: false })
        .pipe(add.handleError('CopySvgSprite'))
        .pipe(add.plugins.gulp.dest(add.paths.svg.destSprite));
    }
    // else {
    //   add.plumberError(`Для создания спрайта поместите .svg в папку: ${add.paths.svg.spriteDest}. Создать спрайт: gulp svg`, 'copySvgSprite');
    // }
  } else {
    console.log(`Создание спрайта отключено в файле ${add.paths.setings} (sprite: 0)`, 'copySvgSprite');
  }
  done();
}


