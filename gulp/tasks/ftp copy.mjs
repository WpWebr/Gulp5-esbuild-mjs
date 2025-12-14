
import { configFTP, remoteFTP } from '../setings/ftp.mjs';
// import { handleError, plumberError } from './errors.mjs';

const muFTP = { configFTP, remoteFTP }



// Асинхронная задача для динамического импорта модуля с использованием переменной для пути
const loadMuFTP = async function() {
  try {
  
    // console.log('до импорта:', add.setings);
    console.log('до путь:', add.paths.ftp);
    // console.log('до путь:', `./${paths.setings}`);

    const module = await import(`./${add.paths.ftp}`); // Используем переменную modulePath
    global.add.setings = module.setings;  // Обновляем глобальную переменную
    
    // console.log('После импорта:', add.setings);

  } catch (err) {
    console.error('Ошибка при импорте модуля "loadMuFTP":', err);
  }
};


export function deploy() {
  
    const connect = add.plugins.vinylFtp.create(configFTP);
    // в какую папку загружать
    // const remoteFolder = `${remoteFTP.remoteFolder}/${setFolders.name}`;
    const remoteFolder = `./${remoteFTP.remoteFolder}`;
    // какой адрес открыть в браузере
    const remoteUrl = `https://${remoteFTP.remoteFolder}.${remoteFTP.remoteUrl}`;

console.log(`${remoteUrl}`);
console.log(`${remoteFolder}`);

    return add.plugins.gulp.src(`${add.paths.dest}/**`, { 
      encoding: false, 
      // base: '.', 
      buffer: false 
    })
      .pipe(add.handleError('FTP'))     

      .pipe(conn.newer(remoteFolder)) // Загружать только новые файлы
      .pipe(conn.dest(remoteFolder))
      .on('end', function () {
        // add.plugins.plumberError('Файлы успешно загружены на FTP-сервер!', FTP);
        console.log('Файлы успешно загружены на FTP-сервер!');
        // log(add.plugins.colors.green('Файлы успешно загружены на FTP-сервер!'));
        // Открываем браузер по умолчанию с указанием URL
        // add.plugins.open(remoteUrl).then(() => {
        //   add.plugins.plumberError(`Открыт браузер по адресу: ${remoteUrl}`, FTP);
        //   // log(add.plugins.colors.blue(`Открыт браузер по адресу: ${remoteUrl}`));
        // }).catch(err => {
        //   add.plugins.plumberError(`Ошибка при попытке открыть браузер: ${err}`, FTP);
        //   // log(add.plugins.colors.red('Ошибка при попытке открыть браузер: '), err);
        // });
      });
  


}