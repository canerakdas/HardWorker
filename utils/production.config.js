const path = require('path');
module.exports = [{
  mode: 'production',
  entry: {
    bundle: path.join(__dirname, '../', 'source', 'index.js')
  },
  output: {
    path: path.join(__dirname, '../', 'dist'),
    filename: 'hardworker.js',
    library: 'HardWorker',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ],
  }
}, {
  mode: 'production',
  entry: {
    bundle: path.join(__dirname, '../', 'source', 'index.js')
  },
  output: {
    path: path.join(__dirname, '../', 'example', 'script'),
    filename: 'hardworker.js',
    library: 'HardWorker',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ],
  }
}];