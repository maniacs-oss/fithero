// eslint-disable-next-line func-names
module.exports = function(api) {
  api.cache(true);
  const presets = ['module:metro-react-native-babel-preset'];
  const plugins = ['react-native-paper/babel'];

  return {
    presets,
    plugins,
  };
};
