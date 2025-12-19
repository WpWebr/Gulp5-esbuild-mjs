// // Обработка JS файлов
// export async function scripts() {
//   const { path, esbuild } = add.plugins;
//   const isDev = !(add.setFolders.isBuild || add.setings.ayBuild);

//   const outdir = path.join(
//     add.paths.dest,
//     'js'
//   );

//   await esbuild.build({
//     // entryPoints: [entry],
//     entryPoints: [add.paths.scripts.entry],
//     bundle: true,
//     outfile: path.join(outdir, 'app.min.js'),
//     sourcemap: isDev,
//     minify: !isDev,
//     target: 'es2018',
//     platform: 'browser',
//     format: 'iife',
//     logLevel: 'info',

//     define: {
//       __LAZY_INIT_MODE__: JSON.stringify(add.setings.lazyInitMode)
//     }
//   });

//   add.plugins.server?.reload();
// }


// Обработка JS файлов
export async function scripts() {
  const { path, esbuild } = add.plugins;
  const isDev = !(add.setFolders.isBuild || add.setings.ayBuild);

  const outdir = path.join(add.paths.dest, 'js');

  const commonConfig = {
    entryPoints: [add.paths.scripts.entry],
    bundle: true,
    sourcemap: isDev,
    target: 'es2018',
    platform: 'browser',
    format: 'iife',
    logLevel: 'info',
    define: {
      __LAZY_INIT_MODE__: JSON.stringify(add.setings.lazyInitMode)
    }
  };

  // 1️⃣ Несжатый файл
  await esbuild.build({
    ...commonConfig,
    outfile: path.join(outdir, 'app.js'),
    minify: false
  });

  // 2️⃣ Сжатый файл
  await esbuild.build({
    ...commonConfig,
    outfile: path.join(outdir, 'app.min.js'),
    minify: true
  });

  add.plugins.server?.reload();
}
