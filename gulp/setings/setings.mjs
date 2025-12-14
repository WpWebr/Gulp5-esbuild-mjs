export const setings = {
  // const defaultSetings = { // Настройки по умолчанию
  ayBuild: true, // ести 'true' то в режиме `development` файлы JS и CSS сжаты и нет `sourcemaps`
  sprite: true, // создавать спрайт - команда `gulp svg`
  spriteDelAtribut: true, // удаление атрибутов .svg для спрайта (fill,stroke,style)
  avif: false, // создавать .avif
  avifQuality: 90, // качество .avif можно настроить (от 0 до 100). По умолчанию 90
  webp: false, // создавать .webp
  imagemin: false, // сжимать изображения
  // При создании изображений .avif и .webp создаётся и тег "picture"
  extensions: ['.png', '.jpg', '.jpeg'], // для каких файлов создаем 'picture'
  noPicture: ['no-picture'],  // если находим этот класс для тега 'img', то не создаем 'picture' (можно ставить несколько классов)
  noPictureDel: true, // удалять классы прописанные в `noPicture`?
  collapseHTML: false, // сжать HTML
  webpCSS: false, // поддержка .webp в CSS (если JS добавил слиль 'wemp' к <html> - см. README.md)
  noCleanCSSfile: false, // создавать не сжатый файл style.css
  copyAll: ['files', 'inc'], // папки преносимые с исходников (src) без изменения
  copyPHP: false // Копирование PHP-файлов и добавление index.php в папки с PHP файлами (для WordPress)
}
