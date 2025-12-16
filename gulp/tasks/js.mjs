// Обработка JS файлов
// export function scripts() {

//   const sourcemaps = !(add.setFolders.isBuild || add.setings.ayBuild);

//   return add.plugins.gulp.src(add.paths.scripts.src, { sourcemaps })
//     .pipe(add.handleError('Scripts'))
//     .pipe(add.plugins.webpack({
//       mode: sourcemaps ? 'development' : 'production',
//       output: {
//         filename: 'app.min.js',
//       }
//     }))
//     .pipe(add.plugins.gulp.dest(add.paths.scripts.dest, { sourcemaps: sourcemaps }))
//     .pipe(add.plugins.server.stream());
// }


// import esbuild from 'esbuild';

// export async function scripts() {

//   const sourcemaps = !(add.setFolders.isBuild || add.setings.ayBuild);
//   try {
//     await add.plugins.esbuild.build({
//       entryPoints: [add.paths.scripts.src], // ⚠️ один вход
//       outfile: `${add.paths.scripts.dest}/app.min.js`,


//       bundle: true,
//       format: 'iife',              // как у webpack для <script>
//       target: 'es2018',

//       sourcemap: sourcemaps,
//       minify: !sourcemaps,

//       logLevel: 'silent'
//     });

//     // 🔥 перезагрузка браузера
//     add.plugins.server.reload();

//   } catch (err) {
//     add.handleError(`Scripts: ${err}`);
//   }
// }


import esbuild from 'esbuild';
import path from 'path';

export async function scripts() {
  const isDev = !(add.setFolders.isBuild || add.setings.ayBuild);

  const entry = path.join(
    // add.paths.src,
    add.paths.scripts.src // например: js/index.js
  );

  const outdir = path.join(
    add.paths.dest,
    'js'
  );

  await esbuild.build({
    // entryPoints: [entry],
    entryPoints: [add.paths.scripts.entry],
    bundle: true,
    outfile: path.join(outdir, 'app.min.js'),
    sourcemap: isDev,
    minify: !isDev,
    target: 'es2018',
    platform: 'browser',
    format: 'iife',
    logLevel: 'info',

    define: {
      __LAZY_INIT_MODE__: JSON.stringify(add.setings.lazyInitMode)
    }
  });

  add.plugins.server?.reload();
}