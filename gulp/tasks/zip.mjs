export function addZip() {
  // имя файта .zip
  const nameZip = `${add.setFolders.allprojects}_${add.setFolders.name}.zip`.split(/\//)[1];
  // удаляем старый
  add.plugins.deleteAsync(`${add.paths.prodject}/${nameZip}`, { force: true });
  // Создание ZIP
  return add.plugins.gulp.src(`${add.paths.dest}/**/*.*`, { encoding: false })
    .pipe(add.handleError('ZIP'))
    .pipe(add.plugins.zip(nameZip))
    .pipe(add.plugins.gulp.dest(`${add.paths.prodject}`));
}
