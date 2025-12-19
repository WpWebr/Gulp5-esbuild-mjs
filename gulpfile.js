import { plugins } from './gulp/config/plugins.mjs'; // плагины
import { setFolders } from './gulp/config/setings_folders.mjs'; // папки текущего проекта
import { loadSettings } from './gulp/utils/loadSettings.mjs';
import { paths } from './gulp/config/paths.mjs'; // пути
import { handleError, plumberError } from './gulp/tasks/errors.mjs'; // ошибки
import { clean, cleanSprite } from './gulp/tasks/del.mjs'; // удаление
import { copyFiles, copyPhp, copyRobots, gifs, copySvg, copyFonsts, copyProcessedImages, copySvgSprite } from './gulp/tasks/copy.mjs'; // копирование
import { fonts, fontsStyle } from './gulp/tasks/fonts.mjs'; // шрифт
import { processImages, createDirs } from './gulp/tasks/images.mjs'; // img
import { svgSpr } from './gulp/tasks/svg.mjs'; // svg
import { html } from './gulp/tasks/html.mjs'; // html
import { styles } from './gulp/tasks/styles.mjs'; // scss
import { scripts } from './gulp/tasks/js.mjs'; // js
import { server } from './gulp/tasks/server.mjs'; // браузер
import { nevProject } from './gulp/tasks/prodject.mjs'; // новый проект
import { info } from './gulp/tasks/info.mjs'; // информация о запущенном проекте
import { addZip } from './gulp/tasks/zip.mjs'; // создание ZIP
// import { deploy } from './gulp/tasks/ftp.mjs'; // FTP
import { deploy } from './gulp/tasks/ftp.mjs'; // FTP
import { validateComponents } from './gulp/tasks/validate-components.mjs';
import { generateComponentsJs } from './gulp/tasks/components-js.mjs';
import { generateComponentsScss } from './gulp/tasks/components-scss.mjs';
import { validateScssDeps } from './gulp/tasks/validate-scss-deps.mjs';
import { generateComponentDocs } from './gulp/tasks/generate_component_docs.mjs';
import { validateComponentDeps } from './gulp/tasks/validate-component-deps.mjs';
import { validateComponentCycles } from './gulp/tasks/validate-component-cycles.mjs';
import { generateScssIndex } from './gulp/tasks/generate-scss-index.mjs';

// глобальная переменная
global.add = {
  plugins,      // плагины 
  paths,        // пути
  setFolders,
  handleError,  // ошибки для .pipe
  plumberError  // ошибки
};
// Добавляем настройки с учетом пользовательских
async function init() {
  const finalSettings = await loadSettings(paths.setings);
  // обновляем глобальную переменную
  global.add = {
    plugins,
    paths,
    setFolders,
    handleError,
    plumberError,
    setings: finalSettings, // настройки
  };
}
await init();

// Отслеживание изменений и удалений
function watchFiles() {
  plugins.gulp.watch(
    plugins.path.join(add.paths.html.components, '**/*'),
    plugins.gulp.series(
      validateComponents,
      validateComponentDeps,
      validateComponentCycles,
      validateScssDeps,
      generateComponentsJs,
      generateComponentsScss,
      generateScssIndex
    )
  );
  plugins.gulp.watch(paths.styles.watch, styles);
  plugins.gulp.watch(paths.scripts.watch, scripts);
  // Следим за добавлением изображений - обрабатываем и добавляем соответствующие файлы в dist/img и src/img_min
  plugins.gulp.watch(paths.images.src, { events: 'add' }, plugins.gulp.series(processImages, copyProcessedImages));
  plugins.gulp.watch(paths.gifs.src, gifs);
  plugins.gulp.watch(paths.files.src, copyFiles);
  // plugins.gulp.watch([paths.htmlIncludes.src, paths.html.src], html);
  plugins.gulp.watch(paths.html.watch, html);
  plugins.gulp.watch(paths.svg.src, copySvg); // Отслеживание изменений SVG файлов
  plugins.gulp.watch(paths.svg.spriteSrc, svgSpr); // Отслеживание изменений SVG для спрайта
  // Следим за папкой с обработанными изображениями
  plugins.gulp.watch(`${paths.images.minDest}/**/*.{jpg,jpeg,png,avif,webp}`)
    .on('change', (filepath) => {
      plugins.gulp.src(filepath, { encoding: false })
        .pipe(plugins.gulp.dest(paths.images.dest));
    });
  // Следим за папками и удаляем соответствующие файлы и папки в dist/ 
  plugins.gulp.watch([
    paths.styles.watch,
    paths.scripts.src,
    paths.gifs.src,
    paths.files.src,
    paths.inc.src,
    paths.svg.src,
    paths.html.watch
  ]).on('unlink', (filepath) => delFile(filepath));

  // При удалении изображений удаляем соответствующие файлы в dist/images и src/imagemin
  plugins.gulp.watch(paths.images.src)
    .on('unlink', (filepath) => {

      const srcImgPath = filepath.replace('images', 'aa/img_min');
      const srcMinPath = filepath.replace('images', 'aa/img');
      const srcMinWebpPath = srcMinPath.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const srcMinAvifPath = srcMinPath.replace(/\.(jpg|jpeg|png)$/, '.avif');
      const destFilePath = filepath.replace(replaceSlash(paths.src), replaceSlash(paths.dest));
      const destWebpPath = destFilePath.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const destAvifPath = destFilePath.replace(/\.(jpg|jpeg|png)$/, '.avif');

      plugins.deleteAsync([srcImgPath, srcMinPath, srcMinWebpPath, srcMinAvifPath, destFilePath, destWebpPath, destAvifPath])
        .then(paths => {
          console.log(`Удаленные изображения:\n${paths.join('\n')}`);
        });

    });

  // Замена '\' на '/'
  function replaceSlash(stroke) {
    return stroke.replace(/\//g, '\\');
  }

  // Удаление файлов и папок
  function delFile(filepath) {
    filepath = filepath.replace('src', setings.dest);
    if (filepath.length > 0) {
      plugins.deleteAsync(filepath).then(paths => {
        console.log(`Удаленные файлы:\n${paths.join('\n')}`);
      });
    } else {
      console.log(`Файлы не найдены:\n${paths.join('\n')}`);
    }

  }
}
// Копирование
const copyAll = plugins.gulp.series(
  copyFiles,
  copyPhp,
  gifs,
  copySvg,
  copyProcessedImages,
  copySvgSprite,
  copyFonsts
);
// Основные задачи
const build = plugins.gulp.series(
  createDirs,
  validateComponents,
  validateComponentDeps,
  validateComponentCycles,
  validateScssDeps,
  generateComponentDocs,
  generateComponentsJs,
  generateComponentsScss,
  generateScssIndex,
  plugins.gulp.parallel(styles, scripts, html),
  processImages,
  svgSpr,
  copyAll,
  info
);
// Основные задачи и наблюдение
const dev = plugins.gulp.series(
  nevProject,
  // loadModule,
  clean,
  build,
  plugins.gulp.parallel(server, watchFiles),
);

// Задача для работы со спрайтом SVG
const svg = plugins.gulp.series(
  // loadModule,
  cleanSprite,
  svgSpr
);

// Создание ZIP
const zip = plugins.gulp.series(
  // loadModule,
  build,
  addZip
);

const ftp = plugins.gulp.series(
  // loadModule,
  build,
  copyRobots,
  deploy
);

export {
  html,
  ftp,
  zip,
  svg,
  build,
  // Шрифт 
  fonts, // конвертация и стили
  fontsStyle, // стили без конвертации
  processImages,
}

// Задача по умолчанию
export default dev;// Основные задачи и наблюдение