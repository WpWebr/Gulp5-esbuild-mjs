import { plugins } from '../config/plugins.mjs';

// export async function nevProject(){
//   return add.plugins.gulp.series(nevProjectSrc, nevSetings);
// }
export const nevProject = plugins.gulp.series(nevProjectSrc, nevSetings);
// Создание нового проекта
function nevProjectSrc(done) {

  // Создание новой папки для проектов
  // и перенос в неё исходного проекта
  if (!add.plugins.fs.existsSync(add.paths.allProdjects)) {
    // Создание новой папки
    // add.plugins.mkdir(add.paths.allProdjects, { recursive: true });
    // Запись в `.gitignore` для исключения папки `add.paths.allProdjects` 
    const nevAllProdjects = add.paths.allProdjects.split(/\//)[0];
    if (!add.plugins.fs.existsSync(nevAllProdjects)) {
      const content = `\n/${nevAllProdjects}/`;
      add.plugins.fs.appendFile('.gitignore', content, (err) => {
        if (err) {
          plumberError(err, `Error (nevProjectSrc) записи в .gitignore`);
          return;
        }
      });
    }

    // Перенос исходников
    return add.plugins.gulp.src(`${add.paths.allSources}/${add.paths.sources}/src/**/*`, { encoding: false })
      .pipe(add.handleError('nevProject_Folder'))
      .pipe(add.plugins.gulp.dest(add.paths.src));

  } else if (!add.plugins.fs.existsSync(add.paths.prodject)) {
    // Создание нового проекта из исходников
    return add.plugins.gulp.src(`${add.paths.allSources}/${add.paths.sources}/src/**/*`, { encoding: false })
      .pipe(add.handleError('nevProject_Folder'))
      .pipe(add.plugins.gulp.dest(add.paths.src));

  } else {
    done();
  }
}
// Перенос папки setings
function nevSetings(done) {
  if (!add.plugins.fs.existsSync(`${add.paths.prodject}/setings`)) {
    // return add.plugins.gulp.src(`${add.paths.allSources}/${add.paths.sources}/setings/**/*`, { encoding: false })
    return add.plugins.gulp.src(`gulp/setings/*`, { encoding: false })
      .pipe(add.handleError('nevSetings'))
      .pipe(add.plugins.gulp.dest(`${add.paths.prodject}/setings`));
  }
  done();
}

