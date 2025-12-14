// Локальный сервер
export function server(done) {
  add.plugins.server.init({
    server: {
      baseDir: add.paths.dest, // папка с результатом
      // index: 'index.html',
    },
    notify: false, // сообщения
    // open: false,
    // port: 3000,
    // browser: 'chrome',    
  });
  done();
}

