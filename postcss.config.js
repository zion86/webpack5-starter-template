module.exports = {
  plugins: [
    require('postcss-combine-duplicated-selectors'),
    require('postcss-merge-queries'),
    require('autoprefixer'),
  ],
};