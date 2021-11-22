const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: ['regenerator-runtime', './src/index.js'],
    barchart: './src/barchart/app.js',
    scatter: './src/scatter/app.js',
    heatmap: './src/heatmap/app.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/barchart/', to: 'barchart' },
        { from: 'src/heatmap/', to: 'heatmap' },
        { from: 'src/scatter/', to: 'scatter' },
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
      {
        test: /\.m?js$/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
  },

};
