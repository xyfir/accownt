const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const config = require('./config');
const path = require('path');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(config.environment.type)
    }
  })
];

const isProd = config.environment.type == 'production';

if (isProd) {
  plugins.push(
    new CompressionPlugin({
      asset: '[path].gz'
    })
  );
}

module.exports = {
  mode: config.environment.type,

  entry: {
    App: './web/components/App.jsx'
  },

  output: {
    chunkFilename: '[name]~[chunkhash]~chunk.js',
    publicPath: '/static/js/',
    filename: '[name].js',
    path: path.resolve(__dirname, 'static/js')
  },

  resolve: {
    modules: [path.resolve(__dirname, 'web'), 'node_modules'],
    alias: {
      server: __dirname
    },
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'web/components'),
          path.resolve(__dirname, 'web/constants'),
          path.resolve(__dirname, 'web/lib')
        ],
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'last 2 iOS versions',
                    'last 2 Android versions'
                  ]
                }
              }
            ],
            '@babel/preset-react'
          ]
        }
      }
    ]
  },

  plugins
};
