const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.root_path = path.resolve(__dirname, '../');
exports.npmPackage = require(exports.root_path+'/package.json');

exports.conf = {

    entry: {
        bundle: exports.root_path + '/src/index.ts',
    },
  
    module: {
       rules: [
            {
              // All files with a '.ts' or '.tsx' extension
              // will be handled by ts-loader (TODO: check benefit of 'awesome-typescript-loader')
              test: /\.tsx?$/,
              loaders: ['ts-loader']
            },
            { 
                // All output '.js' files will have any sourcemaps
                // re-processed by 'source-map-loader'.
                test: /\.js$/,
                loaders: ['source-map-loader'],
                enforce: "pre"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.s[ac]ss$/,
                loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
                })
            }

        ]
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ]
}