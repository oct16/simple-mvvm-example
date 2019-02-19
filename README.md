## CRUISE项目

### 技术简介

- 使用Webpack4作构建工具，集成了开发，打包，测试，分析四个入口
- 使用了Mocha作为单元测试工具
- 使用了TypeScript语言进行构建，通过静态类型编译，提高了代码的可读性与可靠性。
- 使用了Pug作为HTML模版语言，使用了Stylus和Postcss作为CSS预处理
- 使用了Grid网格系统进行页面布局，并针对移动端进行了响应式适配
- 开发了简易的单例对话框组件
- 开发了简易的MVVM双向绑定工具库


### 项目简介

由于项目的其中一个要求是除了构建工具以外，并不能使用任何第三方的库，因此我参考来Vue的源码，造了一个小轮子，用来实现数据绑定，同时实现了几个简单的指令：*for，*if，attr, double mustaches，以及对数组的操作的劫持，以此来方便数据的映射。 
样式方面由于时间成本考虑，只适配DesktopHD与moblie两种分辨率，项目中尝试了css grid布局系统，功能让人足够惊喜，但是该布局并不能适配IE10。

### 使用方法

```
cd to project

npm i 

npm run start
Project is running at http://localhost:8081/

npm run build
npm run test
npm run analyze
```
