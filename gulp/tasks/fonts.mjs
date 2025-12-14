// Шрифт
export async function fonts(done) {
  // Проверка на наличие шрифтов и создание дополнительной папки для .woff, .woff2
  const filesOtfTtf = checkFilesExistence(add.paths.fonts.src, ['.otf', '.ttf']);
  if (filesOtfTtf) {
    // Проверяем существует ли папка и если нет, то создаём   
    if (!add.plugins.fs.existsSync(add.paths.fonts.src_woff)) {
      add.plugins.fs.mkdirSync(add.paths.fonts.src_woff);
    }
    // выполняем серию задач
    // return gulp.series(otfToTtf, ttfToWoff, ttfToWoff2, copyWoffWoff2, generateFontsScss)(done);
    return add.plugins.gulp.series(copyWoffWoff2, otfToTtf, ttfToWoff, fontsStyle)(done);
  } else {
    // const message = `Нет файлов с расширением .ttf или .otf в папке ${add.paths.fonts.src}`;
    // notifierError('Error Fonts', message);

    // console.error(`Error: ${message}`);
    // // Уведомление через Windows
    // notifier.notify({
    //   title: 'Error Fonts',
    //   message: message,
    //   sound: true, // Воспроизведение звука при уведомлении
    // });
    done();
  }
}

// Функция проверки наличия файлов с несколькими расширениями в папке и выводом ошибки // возвращает true|false
export function checkFilesExistence(folderPath, fileExtensions) {
  const fullPath = add.plugins.path.resolve(folderPath); //полный путь к папке
  // Проверяем, существует ли папка
  if (add.plugins.fs.existsSync(fullPath)) {
    // Читаем содержимое папки
    const files = add.plugins.fs.readdirSync(fullPath);
    // Проверяем наличие хотя бы одного файла с любым из указанных расширений
    const hasFiles = fileExtensions.some(extension =>
      files.some(file => file.endsWith(extension))
    );

    // Если файлы найдены, возвращаем true
    if (hasFiles) {
      return true;
    } else {
      // Если файлы не найдены, выводим уведомление об ошибке
      add.plumberError(`В папке ${folderPath} не найдены файлы ${fileExtensions.join(', ')}`, 'File Error');
      // messageError(`В папке ${folderPath} не найдены файлы ${fileExtensions.join(', ')}`);
      return false;
    }

  } else {
    // Если папка не существует выводим уведомление об ошибке
    add.plumberError(`Папка ${folderPath} не существует`, 'File Error')
    // messageError(`Папка ${folderPath} не существует`);
    return false;
  }
}

function copyWoffWoff2() {
  return add.plugins.gulp.src(`${add.paths.fonts.src}/*{.woff,.woff2}`, { encoding: false })
    .pipe(add.plugins.newer(add.paths.fonts.src_woff))
    // выгружаем в папку с результатом
    .pipe(add.plugins.gulp.dest(add.paths.fonts.src_woff));
}

function otfToTtf() { // .otf -> .ttf
  return add.plugins.gulp.src(`${add.paths.fonts.src}/*.otf`, { encoding: false })
    .pipe(add.handleError('otfToTtf'))
    .pipe(add.plugins.fonter({ // Конвертируем в .ttf
      formats: ['ttf']
    }))
    .pipe(add.plugins.newer(add.paths.fonts.src))
    .pipe(add.plugins.gulp.dest(add.paths.fonts.src));// выгружаем в исходную папку
}

function ttfToWoff() { //  .ttf -> .woff/.woff2
  return add.plugins.gulp.src(`${add.paths.fonts.src}/*.ttf`, { encoding: false })
    .pipe(add.handleError('ttfToWoff'))
    // Конвертируем в .woff
    .pipe(add.plugins.fonter({
      formats: ['woff']
    }))
    .pipe(add.plugins.newer(add.paths.fonts.src_woff))
    // выгружаем в папку с результатом 
    .pipe(add.plugins.gulp.dest(add.paths.fonts.src_woff))
    // ищем файлы шрифтов .ttf
    .pipe(add.plugins.gulp.src(`${add.paths.fonts.src}/*.ttf`, { encoding: false }))
    // Конвертируем в .woff2
    .pipe(add.plugins.ttf2woff2())
    .pipe(add.plugins.newer(add.paths.fonts.src_woff))
    // выгружаем в папку с результатом
    .pipe(add.plugins.gulp.dest(add.paths.fonts.src_woff));
}

function ttfToWoff2() { //  .ttf -> .woff/.woff2
  // const filesExist = await checkFilesExistence(add.paths.fonts.src, '.ttf');
  // if (filesExist) {// Ищем файлы шрифтов .ttf
  return add.plugins.gulp.src(`${add.paths.fonts.src}/*.ttf`, { encoding: false })
    .pipe(add.handleError('ttfToWoff2'))
    // Конвертируем в .woff2
    .pipe(ttf2woff2())
    // выгружаем в папку с результатом
    .pipe(add.plugins.gulp.dest(add.paths.fonts.src_woff));
  // }
}

export const fontsStyle = () => {

  add.plugins.fs.readdir(add.paths.fonts.src_woff, function (err, fontsFiles) {
    if (err) {
      console.error(`Не найдена папка ${add.paths.fonts.src_woff}`);
      return;
    }

    if (fontsFiles.length > 0) {// проверяем есть ли файлы шрифтов 
      // Путь файла стилей подключения шрифтов 
      const fontsSCSS = `${add.paths.fonts.scssDest}/${add.paths.fonts.scssFile}`;
      // Проверяем существует ли файл стилей для подключения шрифтов
      if (!add.plugins.fs.existsSync(fontsSCSS)) { // есле нет, то продолжаем
        let newFileOnly;// Переменная для записи названия файла шрифта
        fontsFiles.forEach(file => {
          // Название файла шрифта
          const fontFileName = add.plugins.path.basename(file, add.plugins.path.extname(file));
          // Записываем подключения шрифтов в файл стилей
          if (newFileOnly !== fontFileName) {
            const fontName = getfontName(fontFileName);
            const fontWeight = getFontWeight(fontFileName);
            const fontStyle = getFontStyle(fontFileName);

            add.plugins.fs.appendFile(fontsSCSS,
              `@font-face {
        font-family: '${fontName}';
        src: url('../fonts/${fontFileName}.woff2') format('woff2'),
             url('../fonts/${fontFileName}.woff') format('woff');
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        font-display: swap;
      }\n`, err => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Добавлено свойство в ${fontsSCSS}`);
              }
            });
            // Обновляем переменную для записи названия файла шрифта
            newFileOnly = fontFileName;
          }
        });

      } else {
        // Если файл есть выводим сообщение
        add.plumberError('Файл scss/_fonts.scss уже существует. Для обновления файла нужно его удалить! Команда для создания файла без конвертации шрифтов: gulp fontsStyle', 'fontsStyle');
      }

    } else {
      console.error(`Не найдены файлы шрифтов в ${add.paths.fonts.src_woff}`);
    }
  });

  // Получение названия шрифта
  function getfontName(fontFileName) {
    return fontFileName
      .replace(/Italic|Thin|ExtraLight|UltraLight|Light|Regular|Normal|Medium|SemiBold|DemiBold|Bold|ExtraBold|UltraBold|Black|Heavy/gi, '')// удаляем вес и стиль
      .replace(/^[\s-_]+|[\s-_]+$/g, '') // удаляем все пробелы, "-" и "_" c начала и в конце
      .replace(/^./, fontFileName[0].toUpperCase()); //Первая буква загловная
  }

  // Получение веса шрифта
  function getFontWeight(fontFileName) {
    if (/Thin/gi.test(fontFileName)) return 100;
    if (/ExtraLight|UltraLight/gi.test(fontFileName)) return 200;
    if (/Regular|Normal/gi.test(fontFileName)) return 400;
    if (/Medium/gi.test(fontFileName)) return 500;
    if (/SemiBold|DemiBold/gi.test(fontFileName)) return 600;
    if (/ExtraBold|UltraBold/gi.test(fontFileName)) return 800;
    if (/ExtraBlack|UltraBlack/gi.test(fontFileName)) return 950;
    if (/Light/gi.test(fontFileName)) return 300;
    if (/Bold/gi.test(fontFileName)) return 700;
    if (/Black|Heavy/gi.test(fontFileName)) return 900;
    return 400; // По умолчанию обычный вес
  }

  // Получение стиля шрифта
  function getFontStyle(fontFileName) {
    return /Italic/gi.test(fontFileName) ? 'italic' : 'normal';
  }
  return add.plugins.gulp.src('.');
}
