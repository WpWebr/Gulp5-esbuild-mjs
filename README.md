## Сборка (mjs) Gulp5 + esbuild
- Создавайте проекты без переустановки сборки
[Gulp5](https://gulpjs.com/)
[esbuild](https://esbuild.github.io/)
[mjs](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules)

## Быстрая установки сборки:
- Скачиваем сборку
- в терминале переходим в корнень проекта - команда `npm i`
- создаём файл `gulp\config\setings_add.mjs` и прописываем в нём:
```
// Пути могут быть и внешними. То есть файлы проекта и иходники для нового проекта могут лежать не только в коренной папке (gulp-5). 
const allprojects = 'all/projects'; // папка со всеми текущими проектами 
const name = 'source'; // название текущего проекта
// ----- `allSources` и `sources` - исходники для нового проекта -----
const allSources = 'apps/sources'; // исходная папка (из неё берём проект `sources`)
const sources = 'source'; // папка проекта (в allSources) с которого делаем копию при создании нового проекта
export const setingsAdd = {
  allprojects,// папка со всеми текущими проектами
  name,// название текущего проекта  
  allSources,// исходная папка (из неё берём проект `sources`)
  sources
}
```
- можно запускать сборку (если не менять путь, новый проект будет здесь all\projects\source )

## Команды запуска сборки:

### по умолчанию (режим `development`)
- `gulp`, `gulp dev` или `npm run dev`
- `ctrl` + `c` - выход с режима по умолчанию

### режим `production`
- `npm run build` или `gulp build --build`

_Шрифт конверируется отдельно. Если он уже сконвертирован, то переносится в результат_

### конвертация шрифтов (запускается отдельно)
- `gulp fonts` - конвертация шрифтов в формат woff и woff2 и создания `.scss` файла для их подключения 
- `gulp fontsStyle` - создание `.scss` файла для подключения шрифтов без их конвертации (только если они уже сконвертированы)

### создание спрайта из SVG
- `gulp svg`

### создание ZIP
- `npm run zip` или `gulp zip --build`
(создается в папке проекта)

### отправка по FTP
- `npm run ftp` или `gulp ftp --build`
- настройки в папке проекта `[путь к папке проекта]/setungs/ftp.mjs`:
- ! не забудте исключить настройки FTP в `.gitignore`: 
`**/setings/ftp.mjs`
- в сценарий включена задача копирования на сервер файла robots.txt из папки:
`[путь к папке проекта]/src/_robots/`
```
export const configFTP = {
  host: '', // Адрес FTP сервера
  user: '', // Имя пользователя
  passpord: '', // Пароль
  parallel: 5 // Кол-во одновременных потоков
}
```

## Настройки сборки

### Создание/перключение между верстками (setings.mjs)
- Проекты верстки можно создавать без перенесения всей сборки
- Имя запускаемого или создаваемого проекта и папки с исходниками (для нового проекта) задаются в папке:
 `gulp/config/setings_folders.mjs`
```
const allprojects = 'app/source'; // папка со всеми текущими проектами
const name = 'source'; // название текущего проекта
```
- для создания нового пректа задайте его название переменной 
`name`
- оставьте прежним или измените каталог в переменной 
`allprojects`
- при запуске сборки (`gulp`) будет созданна папка 
`allprojects`/`name` 
- и запушен новый проект на основе исходников перенесённых с папки
`apps/sources/source/src`
- исходные файлы нового проекта в 
`allprojects`/`name`/src
- результат нового проекта в 
`allprojects`/`name`/dist
- для переключения на другую верстку задайте её название `name` и путь `allprojects` к каталогу
- при создании нового основрого каталога (по умолчанию `apps`) его имя вносится в `.gitignire`
- вы можете изменить папку из которой переносятся исходники в соответствующих переменных:
 `allSources` и `sources`:
```
const allSources = 'apps/sources'; // исходная папка (из неё берём проект `sources`)
const sources = 'source'; // папка проекта (в allSources) с которого делаем копию при создании нового проекта
```
- при создании нового проекта исходники и настройки переносятся из выбранного проекта
(по умолчанию: `apps/sources/source`)
- настройки проекта в файле `[путь к папке проекта] / setings /setings.mjs`
(по умолчанию: `apps/sources/source/setings/setings.mjs`):
```
  ayBuild: false, // ести 'true' то в режиме `development` файлы JS и CSS сжаты и нет `sourcemaps`
  sprite: true, // создавать спрайт - команда `gulp svg`. 
  spriteDelAtribut: true, // удаление атрибутов .svg для спрайта (fill,stroke,style)
  avif: false, // создавать .avif
  avifQuality: 90, // качество .avif можно настроить (от 0 до 100). По умолчанию 90
  webp: true, // создавать .webp
  imagemin: true, // сжимать изображения
  // При создании изображений .avif и .webp создаётся и тег "picture"
  extensions: ['.png','.jpg','.jpeg'], // для каких файлов создаем 'picture'
  noPicture : ['no-picture'],  // если находим этот класс для тега 'img', то не создаем 'picture' (можно ставить несколько классов)
  noPictureDel : false, // удалять классы прописанные в `noPicture`?
  collapseHTML: false, // сжать HTML
  webpCSS: true, // поддержка .webp в CSS (если JS добавил слиль 'wemp' к <html> - см. README.md)
  noCleanCSSfile: true, // создавать не сжатый файл style.css
``` 

_Далее в путях под `src` подразумевается `[путь к папке проекта]/src`, а под `dist` - `[путь к папке проекта]/dist`_

### Шрифты (fonts.mjs)
- Для обновления `.scss` файла подключения шрифта
  `src/scss/_fonts.scss` его нужно  _удалить_!
- Файлы шрифтов разместить в папке ` src/fonst `  
- _Не входит_ в общий сценарий и создается отдельно запуском команды:
  `gulp fonts`
- преобразованные файлы находятся в папке `src/fonts/fonts_woff`
- при запуске сборки файлы с `src/fonts/fonts_woff` переносятся в `dist/fonts`

### Обработка изображений
- исходные изображения в папке `src/images`
- настройки в файле `[путь к папке проекта]/setings/setings.mjs`:
```
  avif: false, // создавать .avif
  avifQuality: 90, // качество .avif можно настроить (от 0 до 100). По умолчанию 90
  webp: true, // создавать .webp
  imagemin: true, // сжимать изображения
```
- обрабатываются только новые изображения (из папки `src/images`)
- сжатые изображения в папке `src/aa/img_min`
- созданные .webp и .avif в папке `src/aa/img`
- переносятся в `dist/images`

### Добавляем тег `picture` (html.mjs)
- При создании изображений .avif и/или .webp создаётся тег "picture"
- настройки в файле `[путь к папке проекта]/setings/setings.mjs`:
```
  extensions: ['.png','.jpg','.jpeg'], // для каких файлов создаем 'picture'
  noPicture : ['no-picture'],  // если находим этот класс для тега 'img', то не создаем 'picture' (можно ставить несколько классов)
  noPictureDel : false, // удалять классы прописанные в `noPicture`?
``` 
### Использование изображений `.webp` в CSS
- для проверки поддержания браузером формата `.webp` в JS прописываем:
```
// Проверка поддержки webp
export function isWebp() {
  function testWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  // Добавление класса для HTML
  testWebP(function (support) {
    if (support == true) {
      document.documentElement.classList.add('webp');
    }
    else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
}
```
- Скрипт выше добавляет класс `webp`(при поддержке .webp) или `no-webp` к тегу `html`
- в CSS добаляется стиль для .webp
- Например:
```
.webp body { background-image: url(../images/name.webp); }
.no-webp body { background-image: url(../images/name.jpg); }
```
- настройки в файле `[путь к папке проекта]/setings/setings.mjs`:
```
webpCSS: true, // поддержка .webp в CSS
```

### Создание `.svg` спрайта (svg.mjs)
- `.svg` для спрайта в папке `src/img/sprite`
- настройки в файле `gulp/config/setings.mjs`:
```
  sprite: true, // создавать спрайт - команда `gulp svg`. 
  spriteDelAtribut: 1, // удаление атрибутов .svg для спрайта (fill,stroke,style)
```
- готовый спрайт в папке `src/images/sprite/sprite` (переносятся в `dist/images/sprite`)
- имя файла спрайта: `sprite.svg`
- инструкция для спрайта в папке `src/images/sprite/stack`
- для обновления спрайта команда `gulp svg`(или удалить папку с `.svg` для спрайта) 
- если сборка запущена, то спрайт обновляется при добавления новых `.svg`

### Обработка CSS (stules.mjs)
- все файлы лежащие в src/scss и не начинающиеся с "_" (например _fonts.scss не буудет обработан как отдельный файл) компилируются в отдельные файлы `название.min.css`
- Компиляция SCSS в CSS
- замена `@img/` на `../images/`
- в CSS добавляется стиль для `.webp` (см. "Использование изображений `.webp` в CSS" )
- вендорные префиксы
- групировка медиа запросов
- сжатие - настройки в файле `[путь к папке проекта]/setings/setings.mjs`:
```
noCleanCSSfile: 1, // создавать не сжатый файл style.css
```
- сжатый файл `style.min.css` (создаётся всегда)



<!-- - `npm run all` - создание спрайта + конвертация шрифтов + режим по умолчанию 
- `npm run imagesAll` - обработка изображений (результат в src/zpass/img/)

### Режим сдачи заказа (продакшен) для лендинга (максимальное сжатие всех файлов)
- `npm run buildZ` - режим продакшен
- `npm run zipZ` - создание ZIP архива
- `npm run deployZ` - отправка проекта по FTP на сервер
### Режим сдачи заказа (продакшен) для бэкенда (два варианта файлов сжатый и не сжатый)
- `npm run buildB` - режим продакшен
- `npm run zipB` - создание ZIP архива 
- `npm run deployB` - отправка проекта по FTP на сервер -->

## ПЕРЕНОС СБОРКИ
### Забираем папки и файлы в новую папку:
- apps
- gulp
- gulpfile.js
- .gitignore
- package.json
- README.md
### Запуск в новой папке команда:
- npm i

## СТРУКТУРА ПРОEКТА

```
# Рабочая директория
│
├── apps
|   ├── sourses                            # Каталог для иходников - не удалять
|   |   └── sourses                         # "Проект-каркас" - не удалять
|   |       ├── dist                         # РЕЗУЛЬТАТ - создается автоматически как и все её вложения
|   |       │   ├── css                       # папка стилей
|   |       │   │   ├── style.css              # не сжатый файл стилей
|   |       │   │   └── style.min.css          # сжатый файл стилей
|   |       │   ├── files                     # папка с разными файлами
|   |       │   ├── fonts                     # папка со шрифтами
|   |       │   ├── images                    # папка с изображениями
|   |       │   │   ├── sprite                  
|   |       │   │   |   └── sprite.svg          # спрайт
|   |       │   │   └── svg                    # .svg
|   |       │   ├── js                        # папка для JS файлов
|   |       │   │   └── app.min.js             # сжатый файл
|   |       │   └──  index.html               # HTML файл
|   |       |
|   |       └── src                          # ИСХОДНИКИ
|   |           ├── _robots                    # Файлы нужные для загрузки на сервер
|   |           |   └── robots.txt              # - правила для поисковиков
|   |           ├── aa                         # Вспомогательная папка для изображений и т.п.
|   |           |   ├── img                     # - Изображения .webp, .avif
|   |           |   └── img_min                 # - Изображения сжатые
|   |           ├── files                      # Файлы не требующие обработки - переносятся как есть
|   |           ├── fonts                      # Шрифты - исходники
|   |           ├── sources                    # всякая всячина - не используется                   
|   |           ├── html                       # - HTML компоненты
|   |           │   └── pug                     # - - PUG компоненты (при использовании PUG)
|   |           ├── images                    # - Изображения не обработанные
|   |           │   ├── sprite                  # - .svg для спрайта 
|   |           │   |   ├── sprite                   
|   |           │   |   |   └──  sprite.svg         # -- готовый спрайт
|   |           │   |   └── stask            
|   |           │   |       └── sprite.symbol.html  # -- инструкция
|   |           │   └── svg                    # .svg - не для спрайта
|   |           ├── inc                       # Файлы PHP для WordPress - переносятся как есть
|   |           ├── js                        # Скрипты
|   |           │   ├── modules                # - подключаемые модули
|   |           │   │   └── functions.js        # -- основные функции (настройки слайдеров и т.п.)
|   |           │   └── app.js                 # - главный скрипт - подключение всех скриптов
|   |           ├── scss                      # Стили сайта ( в scss-синтаксисе )
|   |           │   ├── _fonts.scss            # - подключение шрифтов - создается автоматически
|   |           │   └── style.scss             # - главный файл стилей
|   |           ├── index.html                # Главный html-файл
|   |           └── index.pug                 # Главный pug-файл
|   |    
|   └── (название каталога)             # Каталог для проектов (про создание/перключение см. выше)
|       └── (название проекта)            # текущий проект (про создание/перключение см. выше)
|           ├── dist
|           └── src
│
├── gulp                         # папка с вспомогательными файлами
│   ├── config                    # папка с конфигурацией
│   │   ├── path.mjs               # файл с путями
│   │   ├── plugins.mjs            # oбщие плагины используемые в сценариях
│   │   └── setings_foolders.mjs   # настройки запуска/создания текущего проекта             
│   ├── setings                   # папка с настройками
│   │   ├── ftp.mjs                # настройки выгрузки на сервер по умолчанию
│   │   └── setings.mjs            # настройки сборки по умолчанию             
│   ├── tasks                     # Папка для задач
│   │   ├── copy.mjs               # копирование файлов
│   │   ├── del.mjs                # удаление
│   │   ├── errors.mjs             # вывод ошибок
│   │   ├── fonts.mjs              # для шрифтов
│   │   ├── ftp.mjs                # для отправки по FTP
│   │   ├── html.mjs               # - HTML
│   │   ├── images.mjs             # - img
│   │   ├── info.mjs               # вывод в консоль ссылки на запущенный проект
│   │   ├── js.mjs                 # - JS
│   │   ├── prodject.mjs           # создание нового проекта
│   │   ├── server.mjs             # сервер
│   │   ├── styles.mjs             # - SCSS
│   │   ├── svg.mjs                # создание спрайта с .svg файлов
│   │   └── zip.mjs                # задачи
│   └──version.json               # версия файлов (создается автоматически в html.js)
│
├── node_modules                 # "системная" - создается автоматически
│
├── .gitignore                   # игнорируемые файлы для Git
|
├── .stylelintrc.json            # файл с настройками Stylelint 
|
├── gulpfile.js                  # файл с настройками Gulp
├── package-lock.json            # "системный" - создается автоматически
├── package.json                 # файл с настройками сборки и установленными пакетами
└── README.md                    # документация сборки
```

## УСТАНОВКА С НУЛЯ (для Windows)

### Настройка политики запуска скриптов (Execution Policy) PowerShell
- заходим в `PowerShell`
- проверяем политику запуска скриптов командой `Get-ExecutionPolicy`
- если политика отличается от `RemoteSigned`, то вводим команду:
`Set-ExecutionPolicy RemoteSigned –Force`
- проверяем - `Get-ExecutionPolicy`. Политика должна измениться на `RemoteSigned`

### Проверка глобальных установок программ
- `node -v`
- `npm -v`
- если нет, то устанавливаем LTS версию: [https://nodejs.org/](https://nodejs.org/)

- `git -v`
- если нет, то [устанавливаем](https://git-scm.com/download/): [git для Windows](https://git-scm.com/download/win)

- `gulp -v`
- если нет, то устанавливаем глобально `npm i gulp-cli -g`

### Обновление

- node и npm
- Скачиваем и устанавливаем LTS версию: [https://nodejs.org/](https://nodejs.org/) 

- git (если уже установлен)
- `git clone https://github.com/git/git`

- gulp
- `npm rm --global gulp` - удаляем глобально
- `npm i gulp-cli -g`    - устанавливаем глобально


### Инициализация среды
- `npm init`

```
package name: (mu-gulp)
version: (1.0.0)
description: Gulp 5 для верстки
entry point: (index.js)
test command:
git repository: https://github.com/ник/mu-gulp
keywords:
author: ник
license: (ISC)
```

- В _package.json_ прописываем:

```
  "main": "gulpfile.js",
  "type": "module",
```
- создаём `.gitignore`
```
package-lock.json
node_modules/
version.json
# ! не забудьте исключить настройки FTP:
**/setings/ftp.mjs
# здесь папки за которыми не следим
dist/
/app/
```
или берём [тут](https://github.com/github/gitignore/blob/main/VisualStudio.gitignore)
- и дополняем как минимум:
```
package-lock.json
version.json
# ! не забудьте исключите настройки FTP:
**/setings/ftp.mjs
# здесь папки за которыми не следим
dist/
/apps/
``` 
- создаём `gulpfile.js`
- разобраться подробнее с созданием задач [здесь](https://rufri.ru/sovremennaja-cborka-gulp-dlja-veb-razrabotki/)

- создаём основную структуру проекта: (подробнее см. выше) 
```
# Папка проекта
├── apps                          # проеты версток
├── gulp                          # настройки и задачи
├──.gitignore                     # файл для Git - за чем не следит Git
├── gulpfile.js                   # файл с настройками Gulp
├── package.json                  # файл с настройками сборки и установленными пакетами
└── README.md 
```

### Установка плагинов ( npm i -D < название >)
(все плагины подключаются в файле `gulp/config/plugins.mjs` c последующим импортом)
- gulp                     // Галп
- esbuild                  // Обработка JS (замена webpack)
- del                      // для удаления/очистки
- gulp-file-include        // для разбиения HTML на компоненты
- gulp-replace             // Поиск и замена
- (gulp-webp-html-nosvg    // Контейнер _picture_ для .webp формата картинок - или следующий gulp-picture-html - лучше )
- gulp-picture-html        // Контейнер _picture_ для .webp и .avif формата картинок
- gulp-htmlmin             // Сжатие HTML
- gulp-format-html         // разжатие/форматирование
- gulp-version-number      // Динамическая версия файла
- gulp-plumber             // Обработка ошибок
- gulp-notify              // Сообщения-подсказки
- browser-sync             // Локальный сервер

<!-- ### Преключение на использование .pug (если будем использовать)
- в файле _gulp/config/path.js_ в переменной `global.pug = 'html';` меняем `html` на `pug`
- в файле _gulp/tasks/html.js_ комментируем - // .pipe(fileinclude())
- и добавляем:
```
.pipe(pug({
  // Сжатие
  pretty: true,
  // Показывать в терменале какой файл обработан 
  verbase: true
}))
```
- создаем соответствующие файлы _*.pug_ 
- npm i -D gulp-pug              // установка Pug -->

- sass                           // Препроцесор SASS 
- gulp-sass                      // и установщик его (SASS) в Gulp
- gulp-rename                    // Переименование файлов
- gulp-clean-css                 // Сжатие CSS файла
- gulp-webpcss                   // Вывод WEBP изображений для CSS
- webp-converter@2.2.3           // Конвертер в WEBP (версия `@2.2.3` для свазки с `gulp-webpcss`)
- gulp-autoprefixer              // Добавление вендорных префиксов
- gulp-group-css-media-queries   // Группировка медиа запросов
<!-- - webpack webpack-stream         // Webpack и модуль webpack-stream (заменён на esbuild ) -->
- gulp-webp                      // Преобразование изображений в формат .webp
- gulp-avif                      // Преобразование изображений в формат .avif
- gulp-imagemin                  // Сжатие изображений
- gulp-newer                     // Проверка наличия обновления картинки
- gulp-fonter gulp-ttf2woff2     // Преобразование шрифтов
- gulp-svg-sprite                // Создание SVG спрайта
- gulp-if                        // Условное ветвление
- gulp-htmlmin                   // Сжатие HTML и др.

#### Плагины для для работы с BEM и сортировкой CSS (+ см. дальше "Настройки VS Code")

- stylelint                        // основной линтер
- stylelint-config-standard-scss   // стандартные правила для SCSS
- stylelint-config-prettier-scss   //  совместимость с Prettier
- stylelint-order                  // сортировка CSS-свойств
- stylelint-selector-bem-pattern   // проверка BEM-структуры


### Удаление плагинов
- Эта команда удаляет пакет из папки `node_modules`, в файле `package.json` информация о данном пакете остается: 
```
npm uninstall < название >
```
- Чтобы удалить информацию также и из `package.json`, применяется флаг `--save`:
```
npm uninstall < название > --save
```

### Настройки VS Code

- открываем терминал
- Выберите профиль по умолчанию
- выбираем PowerShell

#### Плагины для VS Code
- `Path Autocomplete` - устанавливаем (в VS Code)
- `Stylelint` - устанавливаем (в VS Code)
- `F1` ищем `Open Settings (JSON)`
(пользавательские настройки - settings.json)
- прописываем:
```
"path-autocomplete.pathMappings": {
"@img": "${folder}/(путь к проекту)/src/images", // псевдоним для изображений
"@scss": "${folder}/(путь к проекту)/src/scss", // псевдоним для scss
"@js": "${folder}/(путь к проекту)/src/js", // псевдоним для js
},
"editor.codeActionsOnSave": {
  "source.fixAll.stylelint": true
},
"stylelint.validate": [
  "css",
  "scss"
]

```
- "путь к проекту" - по умолчанию это `apps/sources/source`
- теперь например при написании `@img` будет работать поиск по `./apps/sources/source/images` и выводить подсказки имеющихся файлов

#### Создаём конфиг Stylelint
В корне проекта создаём файл .stylelintrc.json и вставляем следующий конфиг:

```
{
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-prettier-scss"
  ],
  "plugins": [
    "stylelint-order",
    "stylelint-selector-bem-pattern"
  ],
  "rules": {
    "plugin/selector-bem-pattern": {
      "componentName": "[a-z]+(?:-[a-z]+)*",
      "preset": "bem",
      "componentSelectors": {
        "initial": "^\\.{component}(?:__[a-z0-9-]+)?(?:_[a-z0-9-]+)?$"
      }
    },
    "order/properties-order": [
      [
        "position",
        "top",
        "right",
        "bottom",
        "left",
        "z-index",
        "display",
        "flex",
        "flex-direction",
        "justify-content",
        "align-items",
        "width",
        "height",
        "min-width",
        "max-width",
        "min-height",
        "max-height",
        "margin",
        "padding",
        "font",
        "font-family",
        "font-size",
        "font-weight",
        "line-height",
        "text-align",
        "color",
        "background",
        "border",
        "border-radius",
        "box-shadow",
        "transition",
        "transform",
        "animation"
      ],
      {
        "unspecified": "bottomAlphabetical"
      }
    ]
  }
}

```
#### Что делает этот конфиг:
- BEM-валидация
- Разрешены классы в формате:
```
.block
.block_mod
.block__element
.block__element_mod
Plain text
```
- Запрещены двойные элементы или неправильные модификаторы.
- Сортировка CSS-свойств:
  - Свойства упорядочены по логическим группам: layout → box model → typography → visual → animation.
  - Неопределённые свойства идут в алфавитном порядке внизу.
  - SCSS-вложенности
  - Поддерживаются вложенные селекторы с &__element и &_mod.

### Подключение модулей js
#### Подключение слайдера Swiper из npm-modules
- npm i -D swiper  // установка Swiper - [сайт](https://swiperjs.com/get-started)


<!-- 
### Подключение дополнений
- swiper // Слайдер Swiper https://swiperjs.com/get-started -->

<!-- ### Запуск - команда:

#### Режим сдачи заказа (продакшен) для лендинга (максимальное сжатие всех файлов)
- `npm run buildZ` - режим продакшен
- `npm run zipZ` - создание ZIP архива
- `npm run deployZ` - отправка проекта по FTP на сервер
#### Режим сдачи заказа (продакшен) для бэкенда (два варианта файлов сжатый и не сжатый)
- `npm run buildB` - режим продакшен
- `npm run zipB` - создание ZIP архива 
- `npm run deployB` - отправка проекта по FTP на сервер -->


<!-- ## ОСНОВНЫЕ КОМАНДЫ

### Запуск в режиме разработчика :
`gulp dev` или `gulp`
- создание спрайта, обработка изображений и шрифтов здесь не запускается, а только переносится готовый резутьтат.. 

### КОМАНДЫ ЗАПУСКАЕМЫЕ ОТДЕЛЬНО

- `gulp svg` - создание спрайта из SVG
- `gulp fonts` - конвертация шрифтов в формат woff и woff2

`npm run sprite` - создание SVG спрайта
- исходники в src/img/svgicons/
- результат в src/zpass/svgicons/

`npm run fonts` - шрифты
- перед запуском _удалить_ `src/scss/fonts.scss`
- исходники в src/fonst
- результат в src/zpass/fonts -->

## ПРОБЛЕМЫ
- пока не заметил :)
## РЕШЕННЫЕ ПРОБЛЕМЫ
- проблема: 
плагин `browser-sync` не открывает браузер по умолчанию
- решение:
в Windows - `Пуск / Система / Дополнительные параметры системы / Переменные среды` 
Ищем переменную `PATH` - Изменить
И добавляем `C:\Windows\System32`
Должно работать :)

- проблема:
при создании нового проекта и `avif: true, // создавать .avif` в `setings.mjs` возникает ошибка
- решение:
удалить в новых исходниках папку `src/aa` и перзапустить :)