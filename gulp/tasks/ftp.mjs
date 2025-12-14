import { plugins } from '../config/plugins.mjs';

const ftpSet = {
  configFTP: {},
  remoteFTP: {}
}

const loadModule = async function () {
  try {
    // console.log('до импорта:', ftpSet);
    console.log('тек:', add.setFolders.name);
    console.log('base: ', `./${add.paths.dest}`);
    const module = await import(`../../${add.paths.ftp}`); // 
    // Обновляем переменную
    ftpSet.configFTP = module.configFTP;
    ftpSet.remoteFTP = module.remoteFTP;
  } catch (err) {
    console.error('Ошибка при импорте модуля:', err);
  }
};


export const deploy = plugins.gulp.series(loadModule, addFTP);
// export const deploy = plugins.gulp.series(loadModule);

function addFTP() {

  const connect = add.plugins.vinylFtp.create(ftpSet.configFTP);
  // в какую папку загружать на сервере
  // const remoteFolder = `./${ftpSet.remoteFTP.remoteFolder}`;
  const remoteFolder = `./${add.setFolders.name}`;

  const base = `./${add.paths.dest}`
  
  // какой адрес открыть в браузере
  const remoteUrl = `https://${remoteFolder}.${ftpSet.remoteFTP.remoteUrl}`;

  return add.plugins.gulp.src(`${add.paths.dest}/**/*.*`, {
    encoding: false,
    base, 
    buffer: false 
  })
    .pipe(add.handleError('FTP'))
    .pipe(connect.newer(remoteFolder)) // Загружать только новые файлы
    .pipe(connect.dest(remoteFolder)); // Загружать
    // .on('end', function () {
    //   plugins.plumberError('Файлы успешно загружены на FTP-сервер!', FTP);
    //   console.log('Файлы успешно загружены на FTP-сервер!');
    //   // log(add.plugins.colors.green('Файлы успешно загружены на FTP-сервер!'));
    //   // Открываем браузер по умолчанию с указанием URL
    //   // add.plugins.open(remoteUrl).then(() => {
    //   //   add.plugins.plumberError(`Открыт браузер по адресу: ${remoteUrl}`, FTP);
    //   //   // log(add.plugins.colors.blue(`Открыт браузер по адресу: ${remoteUrl}`));
    //   // }).catch(err => {
    //   //   add.plugins.plumberError(`Ошибка при попытке открыть браузер: ${err}`, FTP);
    //   //   // log(add.plugins.colors.red('Ошибка при попытке открыть браузер: '), err);
    //   // });
    // });
}