
### Technical Introduction

- Using Webpack4 as a build tool that integrates development, packaging, testing, and analysis of four portals
- Using Mocha as a unit test tool
- Built using the TypeScript language to improve the readability and reliability of the code through static type compilation.
- Using Pug as an HTML template language, using Stylus and Postcss as CSS pre processors
- Grid grid system for page layout and responsive adaptation for mobile
- Develop a simple singleton dialog component
- Develop a simple MVVM lib


### Project Description

Since one of the requirements of the project is that you can't use any third-party libraries except the build tools, I refer to the Vue1 source code, create a small lib for data binding, and implement a few simple directive. : *for, *if, attr, double mustaches, and observe of array.
Only the resolutions of DesktopHD and moblie are adopted. The css grid layout system is use in the project. The feature is surprise enough, but the layout cannot be work in IE10.

### Instructions

```
Cd to project

npm i

npm run start
```
project is running at http://localhost:8081/
```
npm run build
npm run test
npm run analyze
```