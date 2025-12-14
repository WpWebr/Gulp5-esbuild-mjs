// Обёртка group-css-media-queries (cssMediaQueries) 
// через through2, чтобы можно было использовать в .pipe()
function cssMedia() {
  return add.plugins.through2.obj(function (file, enc, cb) {
    if (file.isBuffer()) {
      let css = file.contents.toString(enc);  // Получаем содержимое файла
      let processedCss = add.plugins.cssMediaQueries(css);     // Обрабатываем CSS
      file.contents = Buffer.from(processedCss);  // Записываем результат обратно
    }
    cb(null, file);  // Передаём файл дальше в поток
  });
}

export function styles() {
  const sourcemaps = !(add.setFolders.isBuild || add.setings.ayBuild);
  return add.plugins.gulp.src(add.paths.styles.src, { sourcemaps: sourcemaps })
    // return add.plugins.gulp.src(add.paths.styles.src, { sourcemaps: true })
    .pipe(add.handleError('Styles'))
    // .pipe(add.plugins.gulpIf(!add.setFolders.isBuild, add.plugins.sourcemaps.init()))
    .pipe(add.plugins.sass({ // Компиляция SCSS в CSS
      outputStyle: 'expanded'
    }))
    .pipe(add.plugins.replace(/@img\//g, '../images/'))
    // Поддержка .webp для CSS
    .pipe(add.plugins.gulpIf(add.setings.webpCSS, add.plugins.webpcss({
      webpClass: '.webp', // класс при поддержке .webp
      noWebpClass: '.no-webp' // класс если .webp не поддерживается
    })))
    .pipe(add.plugins.autoprefixer({
      grid: true,
      overrideBrowserslist: ['last 3 versions'],
      cascade: true
    }))
    .pipe(cssMedia())// групировка медиа запросов
    .pipe(add.plugins.gulpIf(add.setings.noCleanCSSfile, add.plugins.gulp.dest(add.paths.styles.dest))) // сохранить не сжатый файл
    .pipe(add.plugins.cleanCSS()) // сжатие
    // .pipe(add.plugins.rename({
    //   extname: '.min.css'
    // }))
    .pipe(add.plugins.rename(function (path) {
      // Проверяем имя исходного файла без расширения
      if (path.basename === 'style-rtl') {
        // Для style-rtl.css → style.min-rtl.css
        path.basename = 'style.min-rtl';
      } else {
        // Для всех остальных — просто добавляем .min перед .css
        path.basename += '.min';
      }
      path.extname = '.css';
    }))
    .pipe(add.plugins.gulp.dest(add.paths.styles.dest, { sourcemaps: sourcemaps }))
    .pipe(add.plugins.server.stream());
} 
