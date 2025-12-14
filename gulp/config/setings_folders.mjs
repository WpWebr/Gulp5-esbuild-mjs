import { setingsAdd } from './setings_add.mjs'; // настройки пути к папке текущего проекта
// Пути могут быть и внешними. То есть файлы проекта и иходники для нового проекта могут лежать не только в коренной папке (gulp-5).  
// Код с файла setings_add.mjs :
// const name = 'source'; // название текущего проекта
// const allprojects = 'apps/sources'; // папка со всеми текущими проектами
// // ----- `allSources` и `sources` - исходники для нового проекта -----
// const allSources = 'apps/sources'; // исходная папка (из неё берём проект `sources`)
// const sources = 'source'; // папка проекта (в allSources) с которого делаем копию при создании нового проекта
// export const setingsAdd = {
//   name,// название текущего проекта
//   allprojects,// папка со всеми текущими проектами
//   allSources,// исходная папка (из неё берём проект `sources`)
//   sources
// }
const name = setingsAdd.name; // название текущего проекта
const allprojects = setingsAdd.allprojects; // папка со всеми текущими проектами

const allSources = setingsAdd.allSources;// исходная папка (из неё берём проект `sources`)
const sources = setingsAdd.sources; // папка проекта (в allSources) с которого делаем копию при создании нового проекта 


export const setFolders = {
  name, // название текущего проекта
  allprojects, // текущая папка со всеми проектами
  allSources, // отсюда берём sources
  sources, // исходники для нового проекта
  isBuild: process.argv.includes('--build'), // если есть флаг `--build` то - режим `production` (!не менять)
}
