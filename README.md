
### Technical Introduction

- Using Webpack integrates development、packaging、testing and analysis
- Using Mocha as a unit test tool
- Using the TypeScript language to improve the readability and the reliability of the code.
- Using Pug as an HTML template language, using Stylus and Postcss as CSS pre processors
- Using css grid system for page layout and adapt mobile
- Simply singleton dialog component
- Simply MVVM lib


### Project Description

One of the requirements of the project is that you can't use any third-party libraries except the build tools, I refer to the Vue1 source code, create a small lib for data binding, and implement a few simple directive: *for, *if, attr, double mustaches, and observe of array.
Only provide the resolutions of DesktopHD and moblie. The CSS grid feature is cool, but it's not work in IE10-.

### Instructions

```
cd to project

npm i

npm run start
```
project is running at http://localhost:8081/
```
npm run build
npm run test
npm run analyze
```
