# vue_shop_admin

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## 功能列表

### 登录

- [x] 登录页面及登录功能
- [x] Home 页面权限控制
- [x] 退出登录

### 主页

- [x] 主页布局
- [x] Aside 导航

### 用户管理

- [x] 页面布局
- [x] 列表数据渲染
- [x] 搜索

### 权限管理

- [x] 角色列表
- [x] 权限列表

### 商品管理

- [x] 商品分类
- [x] 分类参数
- [x] 商品列表
  - [ ] 商品编辑

### 订单管理

- [x] 订单列表

### 数据统计

- [x] 数据报表

### 优化 Vue 项目

- [x] 优化策略
  - [x] nprogress 加载进度条
  - [x] serve 控制台警告消除
  - [x] transform-remove-console 插件，build 自动移除 console.log
  - [x] 在 vue.config.js 文件中修改 webpack 的默认配置
  - [x] 首页内容定制
- [x] 打包优化
  - 通过 vue.ui 控制台和分析查看项目报告
  - 为开发模式与发布模式指定不同的打包入口
    > vue.config.js 中自定义 webpack 的打包配置
- [x] 第三方库启用 CDN 加速
  - 通过 externals 加载外部 CDN 资源
- [x] Element-UI 组件按需加载
- [ ] 路由懒加载
  > @babel/plugin-syntax-dynamic-import
- [ ] 首页内容定制

### 部署 Vue 项目

- node 创建 web 服务器
- 开启 gzip 配置
  > 第三方包 compression
- [ ] 配置 https 服务
  > 对传输的数据进行加密
  - [ ] 申请域名
  - [ ] 申请 SSL 证书：https://freessl.cn
- 使用 pm2 管理应用
