const path = require('path');

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        fs: false,
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        url: require.resolve('url/'),
        http: require.resolve('stream-http'),
        os: require.resolve('os-browserify/browser'),
        timers: require.resolve('timers-browserify'),
        process: require.resolve('process/browser'),
        dns: false,
        tls: false,
        net: false,
        child_process: false,
      };
      return webpackConfig;
    },
  },
};
