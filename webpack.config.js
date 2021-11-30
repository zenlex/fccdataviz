const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: ['regenerator-runtime', '/src/js/index.js'],
    barchart: ['/src/js/barchart.js'],
    heatmap: ['/src/js/heatmap.js'],
    scatter: ['/src/js/scatter.js'],
    choropleth: ['/src/js/choropleth.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
    },
  },
  plugins: [

    new CopyPlugin({
      patterns: [
        {
          from: 'src/templates',
        },
      ],
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
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
  },

};
