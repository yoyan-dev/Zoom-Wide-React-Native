module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.tsx',
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
          ],
          alias: {
            '@': './',
          },
        },
      ],
    ],
  };
};
