const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: ['@storybook/addon-viewport'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };
    config.resolve.extensions.push(".js", ".jsx");
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
};
