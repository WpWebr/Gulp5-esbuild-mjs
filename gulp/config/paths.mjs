import { setings } from '../setings/setings.mjs'; // настройки по умолчанию
import { setFolders } from './setings_folders.mjs'; // папки текущего проекта

const prodject = `${setFolders.allprojects}/${setFolders.name}`;// текущий проект
const src = `${prodject}/src` // папка с исходниками
// const dest = `${prodject}/${setings.dest}`; // папка с результатами
const dest = `${prodject}/dist`; // папка с результатами
const spriteName = 'sprite.svg'; // название спрайта

export const paths = {
  prodject,// текущий проект
  allProdjects: setFolders.allprojects,// текущие проекты
  allSources: setFolders.allSources,// отсюда копируем sources
  sources: setFolders.sources,// копируемый проект
  dest,// теукущие результататы 
  src,// теукущие исходники
  setings: `${prodject}/setings/setings.mjs`,// настройки
  ftp: `${prodject}/setings/ftp.mjs`,// настройки ftp
  spriteName,
  html: {
    pages: `${src}/html/pages`,
    src: `${src}/html/pages/*.html`,
    components: `${src}/html/components`,
    watch: `${src}/**/*.html`,
    dest: `${dest}`,
  },
  scss: {
    src: `${src}/scss`,
    entry: `${src}/scss/style.scss`,
  },
  styles: {
    index: `${src}/scss/${setings.scssIndexFile}`,
    scss: `${src}/scss`,
    src: `${src}/scss/*.scss`,
    watch: `${src}/scss/**/*.scss`,
    dest: `${dest}/css`,
  },
  scripts: {
    // index: `${src}/js/index.js`,
    js: `${src}/js`,
    src: `${src}/js/app.js`,
    entry: `${src}/js/app.js`,
    watch: `${src}/js/**/*.{mjs,js}`,
    dest: `${dest}/js`,
  },
  images: {
    src: `${src}/images/**/*.{jpg,jpeg,png}`,
    minDest: `${src}/aa/img`,
    imgMin: `${src}/aa/img_min`,
    imgMinSrc: `${src}/aa/img_min/**/*`,
    srcDest: `${src}/aa/img/**/*`,
    dest: `${dest}/images`,
  },
  gifs: {
    src: `${src}/images/**/*.gif`,
    dest: `${dest}/images`,
  },
  svg: {
    src: `${src}/images/svg/**/*.svg`,
    srcFolder: `${src}/images/svg/`,
    spriteSrc: `${src}/images/sprite/*.svg`,
    spriteDest: `${src}/images/sprite`,
    // sprite: `${src}/images/sprite/sprite/${setings.spriteName}`,
    sprite: `${src}/images/sprite/sprite/${spriteName}`,
    // sprite: `${src}/images/sprite/sprite/sprite.svg`,
    dest: `${dest}/images/svg`,
    destSprite: `${dest}/images/sprite`,
  },
  files: {
    src: `${src}/files/**/*`,
    robots: `${src}/_robots/robots.txt`,
    dest: `${dest}/files`,
  },
  inc: {
    src: `${src}/inc/**/*`,
    incFolder: `${src}/inc/`,
    dest: `${dest}/inc`,
  },
  robots: {
    src: `${src}/_robots/robots.txt`,
  },
  // htmlIncludes: {
  //   src: `${src}/html/**/*.html`,
  //   dest: `${dest}`,
  // },
  fonts: {
    src: `${src}/fonts`,
    src_woff: `${src}/fonts/fonts_woff`,
    scssDest: `${src}/scss`, // Папка для файла _fonts.scss
    scssFile: `_fonts.scss`, // Имя SCSS файла для подключения шрифтов
    dest: `${dest}/fonts`,
  }

}