const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../', './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080
  },
  entry: {
    bundle: path.join(__dirname, '../', 'source', 'index.development.js')
  },
  output: {
    path: path.join(__dirname, '../', 'dist'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'example/template.html' }),
  ]
};