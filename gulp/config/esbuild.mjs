export function getEsbuildConfig({ isBuild }) {
  return {
    entryPoints: ['src/js/index.js'],
    outfile: 'dist/js/app.js',

    bundle: true,
    format: 'esm',          // или 'iife' если нужен <script>
    target: ['es2018'],
    sourcemap: !isBuild,

    minify: isBuild,
    treeShaking: true,

    loader: {
      '.js': 'js',
      '.png': 'file',
      '.svg': 'file'
    },

    define: {
      __DEV__: JSON.stringify(!isBuild)
    }
  };
}
