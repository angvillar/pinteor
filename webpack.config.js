const path = require('path');

module.exports = {
  // the entry file for the bundle
  entry: './client/src/app.jsx',

  // the bundle file we will get in the result
  output: {
    path: path.resolve(__dirname, 'client/dist/js'),
    filename: 'app.js',
  },
  
  mode: 'development',

  module: {

    // apply loaders to files that meet given conditions
    rules: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, '/client/src'),
      loader: 'babel-loader',
      query: {
        presets: ["react", "es2015"]
      }
    }],
  },

  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: true
};