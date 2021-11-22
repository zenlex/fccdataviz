const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/barchart', to: 'barchart' },
        { from: 'src/heatmap', to: 'heatmap' },
        { from: 'src/scatter', to: 'scatter' },
      ],
    }),

    new HtmlWebpackPlugin({
      title: 'FCC Data Visualization Course Projects',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

};
