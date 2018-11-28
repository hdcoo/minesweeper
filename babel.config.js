module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        targets: {
          browsers: [
            'chrome >= 30',
            'safari >= 8',
            'iOS >= 8',
            'android >= 4.4',
            'ie > 10'
          ]
        }
      }
    ]
  ];
  const plugins= [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread'
  ];
  const env = {
    test: {
      presets: [['@babel/preset-env', { 'targets': { 'node': 'current' } }]]
    }
  };
  return {
    presets,
    plugins,
    env
  }
};