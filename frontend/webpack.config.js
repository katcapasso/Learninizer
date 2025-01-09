const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your app
  output: {
    path: path.resolve(__dirname, 'dist'), // Where to output bundled files
    filename: 'bundle.js', // Name of the output file
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Look for JS or JSX files
        exclude: /node_modules/, // Exclude node_modules from transpiling
        use: {
          loader: 'babel-loader', // Use Babel to transpile JS/JSX files
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Use Babel presets
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing JS and JSX files without file extensions
  },
  devtool: 'source-map', // Optional: helps with debugging by generating source maps
  mode: 'development', // Set to 'production' for production builds
};
