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


import esbuild from 'esbuild';

export async function scripts() {

  const sourcemaps = !(add.setFolders.isBuild || add.setings.ayBuild);

  try {
    await esbuild.build({
      entryPoints: [add.paths.scripts.entry], // ⚠️ один вход
      outfile: `${add.paths.scripts.dest}/app.min.js`,

      bundle: true,
      format: 'iife',              // как у webpack для <script>
      target: 'es2018',

      sourcemap: sourcemaps,
      minify: !sourcemaps,

      logLevel: 'silent'
    });

    // 🔥 перезагрузка браузера
    add.plugins.server.reload();

  } catch (err) {
    add.handleError('Scripts')(err);
  }
}

