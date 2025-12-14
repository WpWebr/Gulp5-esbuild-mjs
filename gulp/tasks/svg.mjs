import { handleError, plumberError } from './errors.mjs';

// Обработка SVG и создание спрайта
export function svgSpr(done) {

  if (add.setings.sprite && !add.plugins.fs.existsSync(add.paths.svg.sprite)) {

    // Создание папки src/images/sprite, если её нет
    if (!add.plugins.fs.existsSync(add.paths.svg.spriteDest)) {
      add.plugins.mkdir(add.paths.svg.spriteDest, { recursive: true });
    }

    add.plugins.fs.readdir(add.paths.svg.spriteDest, function (err, files) {
      if (err) {
        // some sort of error
        plumberError(`Ошибка в copySvgSprite`);
      } else {
        if (files.length) {
          return add.plugins.gulp.src(add.paths.svg.spriteSrc)
            .pipe(handleError('SVG'))
            .pipe(add.plugins.svgmin({
              js2svg: {
                // Beutifies the SVG output instead of
                // stripping all white space.
                pretty: true,
                // indent: 2,
              }
            }))
            .pipe(add.plugins.gulpIf(add.setings.spriteDelAtribut, add.plugins.cheerio({
              run: ($) => {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
              },
              parserOptions: { xmlMode: true }
            })))
            .pipe(add.plugins.replace('&gt;', '>'))
            .pipe(add.plugins.svgSprite({
              mode: {
                stack: {
                  sprite: `../sprite/${add.paths.spriteName}`, // имя файла спрайта
                  example: true // превью-инструкция
                }
              }
            }))
            .pipe(add.plugins.gulp.dest(add.paths.svg.spriteDest));
        } else {
          // directory appears to be empty
          plumberError(`Для создания спрайта поместите .svg в папку: ${add.paths.svg.spriteDest}. Создать спрайт: gulp svg`, 'svgSpr');
        }
      }
    });

  } else if (!add.setings.sprite) {
    console.log(`Создания спрайта отключено. Для создания в файле ${add.paths.setings} установите sprite: 1`, 'svgSpr');
  }
  done();
}