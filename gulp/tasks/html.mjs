export function html() {
  const picture = add.setings.avif || add.setings.webp;
  let pictureSource;
  if (add.setings.avif && add.setings.webp) {
    pictureSource = ['.avif', '.webp'];
  } else if (add.setings.avif) {
    pictureSource = ['.avif'];
  } else {
    pictureSource = ['.webp'];
  }
  return add.plugins.gulp.src(add.paths.html.src)
    .pipe(add.handleError('HTML'))
    .pipe(add.plugins.fileInclude()) // собираем HTML
    .pipe(add.plugins.replace(/@img\//g, 'images/'))
    .pipe(add.plugins.gulpIf(picture, add.plugins.pictureHTML( // добавляем <picture>
      {
        extensions: add.setings.extensions,  // для каких файлов создаем 'picture'
        source: pictureSource,  // создаем 'source' с этими форматами      
        noPicture: add.setings.noPicture,   // если находим этот класс для тега 'img', то не создаем 'picture' (можно ставить несколько классов)
        noPictureDel: add.setings.noPictureDel // удалять классы прописанные в `noPicture`?
      }
    )))
    .pipe(add.plugins.gulpIf(!add.setFolders.isBuild, add.plugins.versionNumber({ // версия файлов
      'value': '%DT%',
      // 'value': '%MDS%',
      'append': {
        'key': '_v',
        'cover': 0,
        'to': [
          'css',
          'js',
        ]
      },
      'output': {
        'file': 'gulp/version.json'
      }
    }
    )))
    .pipe(add.plugins.gulpIf(add.setings.collapseHTML, add.plugins.htmlmin({ // сжимаем
      collapseWhitespace: true,
      removeComments: true, // удалить коменты
    })))
    .pipe(add.plugins.gulp.dest(add.paths.html.dest))
    .pipe(add.plugins.server.stream());
}


