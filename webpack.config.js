const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const FontPreloadPlugin = require("webpack-font-preload-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const fileName = (ext = '[ext]') => isDev ? `[name]${ext}` : `[contenthash:8]${ext}`;

module.exports = {

  entry: [ './src/index.js', './src/index.scss' ],

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: fileName('.js'),
    publicPath: '',
    clean: true,
  },

  devServer: {
    open: true,
    hot: false,
  },

  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: `assets/images/${fileName()}`,
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              disable: isDev
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: `assets/fonts/${fileName()}`,
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: fileName('.css'),
    }),
    new StylelintPlugin({
      files: '**/*.scss',
      configFile: '.stylelintrc.json',
      fix: true,
    }),
    new ESLintPlugin({
      fix: true,
    }),
    new copyWebpackPlugin({
      patterns: [
        { from: './src/assets/images/svg', to: './assets/images/svg' },
      ],
    }),
    new FontPreloadPlugin({
      extensions: [ 'woff', 'woff2', 'ttf', 'eot' ],
      crossorigin: true,
    }),
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/icons/favicon.png',
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }),
  ],

};