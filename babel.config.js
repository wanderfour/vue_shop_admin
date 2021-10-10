// 这是项目发布阶段需要用到的 bable 插件
const prodPlugins = []
// 发布阶段，则向`prodPlugins `数组中加入插件`transform-remove-console`
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时的插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
