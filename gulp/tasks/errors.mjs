// обработка для .pipe
export function handleError(task) {
  return add.plugins.plumber({
    errorHandler: add.plugins.notify.onError({
      title: `${task} Error`,
      message: '<%= error.message %>',
      sound: 'Basso'
    })
  });
} 
// Обработка ошибок console и Windows
export function plumberError(message, title = 'Error') {
  const addError = { 
    title: title,
    message: message,
    sound: true
  }
  add.plugins.gulp.src('.')
    .pipe(add.plugins.plumber({
      errorHandler: add.plugins.notify.onError(addError)
    }))
    // Также показываем одноразовое уведомление
    .pipe(add.plugins.notify(addError));
}
// c помощью node-notifier
export function notifierError(message, title = 'Error') {
  console.error(`${title}: ${message}`);
  // Уведомление через Windows
  add.plugins.notifier.notify({
    title: title,
    message: message,
    sound: true, // Воспроизведение звука при уведомлении
  });
}