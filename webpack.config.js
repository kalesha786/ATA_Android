const path = require('path');

module.exports = {
  entry: './index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js' // Output filename
  },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/")
    }
  }
  // Other webpack configuration options...
};