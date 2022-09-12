const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      hash: true
    }),
    new WebpackShellPlugin({
      onBuildStart: [
        'tsc src/electron/main.ts --outDir ./public',
        'tsc src/electron/preload.ts --outDir ./public',
        'tsc src/electron/renderer.ts --outDir ./public'
      ]
    })
  ]
});
