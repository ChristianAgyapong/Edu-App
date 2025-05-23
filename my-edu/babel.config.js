module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      'expo-router/babel',
      ['module-resolver', {
        alias: {
          '@components': './components',
          '@constants': './constants',
          '@utils': './utils',
        },
      }],
    ],
  };
}; 