const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const fileName = (ext = '[ext]') => isDev ? `[name].${ext}` : `[name]-[contenthash].${ext}`;

module.exports = {
  entry: ['./src/index.js', './src/index.scss'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: fileName('js'),
  },
  devtool: 'source-map',
  optimization: {
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
        use: ['babel-loader'],
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
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './assets/img/',
              name: fileName(),
              esModule: false,
              emitFile: true,
            },
          },
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
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './assets/fonts/',
              name: fileName(),
              esModule: false,
              emitFile: true,
            }
          }
        ],
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
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css'),
    }),
    new StylelintPlugin({
      configFile: '.stylelintrc.json',
      fix: true,
    }),
    new ESLintPlugin({
      fix: true,
    }),
    new copyWebpackPlugin({
      patterns: [
        { from: './src/assets/svg-sprites', to: './assets/svg-sprites' },
      ],
    }),
  ],
};