const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new WebpackShellPlugin({
      onBuildStart: [
        'tsc -w ./src/electron/main.ts --outDir ./public',
        'tsc -w ./src/electron/preload.ts --outDir ./public',
        'tsc -w ./src/electron/renderer.ts --outDir ./public'
      ],
      onBuildEnd: [
        'electron public/main.js'
      ]
    })
  ]
});
