export function info(done) {

  if (add.setFolders.isBuild) {
    add.plumberError(`Собран проект "${add.paths.allProdjects}/${add.setFolders.name}"`, 'Info');
    done();
  } else {
    add.plumberError(`Запущен проект "${add.paths.allProdjects}/${add.setFolders.name}"`, 'Info');
    done();
  }

}
