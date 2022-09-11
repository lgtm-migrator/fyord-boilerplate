const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new WebpackShellPlugin({
      onBuildStart: [
        'tsc -w ./src/electron/*.ts --outDir ./public'
      ],
      onBuildEnd: [
        'electron public/main.js'
      ]
    })
  ]
});
