import { plugins } from '../config/plugins.mjs';

// Обработка изображений (кроме GIF) и сохранение в папку src/images
export const processImages = plugins.gulp.series(imagesDest, imagemin, webp, avif);

// export async function processImages(){
//   return add.plugins.gulp.series(imagesDest, imagemin, webp, avif);
// }

// Создание папок src/img и src/img/img_min, если их нет
export function imagesDest(done) {
  if (!add.plugins.fs.existsSync(add.paths.images.minDest)) {
    add.plugins.mkdir(add.paths.images.minDest, { recursive: true });
  }
  if (!add.plugins.fs.existsSync(add.paths.images.imgMin)) {
    add.plugins.mkdir(add.paths.images.imgMin, { recursive: true });
  }
  done();
}

// Сжимаем
function imagemin() {
  return add.plugins.gulp.src(add.paths.images.src, { encoding: false })
    .pipe(add.handleError('Images'))
    .pipe(add.plugins.newer(add.paths.images.imgMin))
    .pipe(add.plugins.gulpIf(globalThis.add.setings.imagemin, add.plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(add.plugins.gulp.dest(add.paths.images.imgMin));
}
// Создаём .webp
function webp(done) {
  if (globalThis.add.setings.webp) {
    return add.plugins.gulp.src(add.paths.images.imgMinSrc, { encoding: false })
      .pipe(add.handleError('Images'))
      .pipe(add.plugins.newer(add.paths.images.minDest))
      .pipe(add.plugins.webp())
      .pipe(add.plugins.gulp.dest(add.paths.images.minDest));
  }
  done();
}
// Создаём .avif
function avif(done) {
  if (globalThis.add.setings.avif) {
    return add.plugins.gulp.src(add.paths.images.imgMinSrc, { encoding: false })
      .pipe(add.handleError('Images'))
      .pipe(add.plugins.newer(add.paths.images.minDest))
      .pipe(add.plugins.avif({ quality: globalThis.add.setings.avifQuality }))// преобразуем в формат .avif, качество можно настроить (от 0 до 100)
      .pipe(add.plugins.gulp.dest(add.paths.images.minDest));
  }
  done();
}
// Создание папок src/images и src/images/sprite, если их нет
export function createDirs(done) {
  if (!add.plugins.fs.existsSync(add.paths.images.minDest)) {
    add.plugins.mkdir(add.paths.images.minDest, { recursive: true });
  }
  if (!add.plugins.fs.existsSync(add.paths.svg.spriteDest) && add.setings.sprite) {
    add.plugins.mkdir(add.paths.svg.spriteDest, { recursive: true });
  }
  done();
}