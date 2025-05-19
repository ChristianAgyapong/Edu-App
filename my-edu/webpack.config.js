const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@react-native-async-storage/async-storage',
        'react-native-reanimated'
      ]
    }
  }, argv);

  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'components'),
    '@constants': path.resolve(__dirname, 'constants'),
    '@utils': path.resolve(__dirname, 'utils'),
    'react-native/Libraries/UTFSequence': path.resolve(__dirname, 'node_modules/react-native-web/dist/exports/UTFSequence'),
  };

  // Add fallbacks for web compatibility
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "fs": false,
  };

  // Optimize chunks for better performance
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  };

  // Add performance hints
  config.performance = {
    ...config.performance,
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  };

  return config;
}; 