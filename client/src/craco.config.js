const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for node core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "buffer": require.resolve("buffer/"),
        "util": require.resolve("util/"),
        "querystring": require.resolve("querystring-es3"),
        "crypto": require.resolve("crypto-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
      };

      // Add ProvidePlugin
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  },
};