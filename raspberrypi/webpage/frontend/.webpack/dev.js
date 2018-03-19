const webpack = require('webpack');
const merge = require('webpack-merge');
const com = require('./common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log("Development Mode ver "+com.npmPackage.version);
exports.conf = merge(com.conf, {

  output: {
    filename: 'bundle.js',
  },

  devtool: 'source-map', 

  plugins: [

      /* webpack option */
      new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true
      }),

      /* global definition */
      new webpack.DefinePlugin({
           __PROD__: JSON.stringify(false),
           __VERSION__: JSON.stringify(com.npmPackage.version),
      }),

      /* html page */
      new HtmlWebpackPlugin({
            template: com.root_path + "/assets/index.html"
      }),

      /* hmr */
      new webpack.HotModuleReplacementPlugin()
    ]  
});

