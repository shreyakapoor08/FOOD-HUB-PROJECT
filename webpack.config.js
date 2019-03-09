const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'],                        // '.' means the current folderwill look for dependency in which it is working
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/bundle.js' //where to save it
    },
    //mode: 'development'
    // development mode build bundle without minifying our code but production
    devServer: {
      contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: { //to configuer babel loader
        rules: [
            {
                test: /\.js$/, //it is a regular expression, that we want to test all the js files, it will look for all the file and check weather it end with .js
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};