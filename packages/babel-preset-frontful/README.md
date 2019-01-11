# <a href="https://github.com/frontful/babel-preset-frontful"><img heigth="75" src="http://www.frontful.com/assets/packages/babel-preset.png" alt="Babel Preset Frontful" /></a>

[`babel-preset-frontful`](https://github.com/frontful/babel-preset-frontful) is packaged provider of [Babel](https://babeljs.io/) preset and package build and deployment utilities. It is default transpiler setup and package build instrument for [Frontful](https://github.com/frontful) infrastructure

### Installation

```shell
# Using yarn
yarn add babel-preset-frontful
# or npm
npm install -s babel-preset-frontful
```

### Integration

#### Package build and deployment

`babel-preset-frontful` is part of [_Package development assist_](https://github.com/frontful/frontful-common#package-development-assist) and apart from Babel preset it provides basic build and deployment instrumentation for packages.

When installed `babel-preset-frontful` script is added to package projects `node_modules/.bin` that can be used in `scripts` section of `package.json`

```javascript
// package.json
{
  "scripts": {
    "build": "babel-preset-frontful build",
    "deploy": "babel-preset-frontful deploy"
  }
}
```
##### Build
```shell
# Using yarn
yarn build
# or npm
npm run build
```
`babel-preset-frontful build` script has no opinions about your packages structure. It takes all files and folders excluding `/node_modules`, copies them to `/build` folder and transpiles each supported file e.g `.js` and `.jsx` using its preset.

##### Deploy
```shell
# Using npm
npm run deploy
```
`babel-preset-frontful deploy` script builds package using `babel-preset-frontful build` and deploys `/build` folder content to [Npm registry](https://www.npmjs.com/).  
`deploy` script does not handle authentication to npm, you should be signed in and have permission to deploy. Use `npm login` command or configure `.npmrc` file for that.
`deploy` script gives few extra features
  - Minor package version will be automatically incremented
  - Package won't be deployed if files have not changed. This is ensured by generating and comparing hash of all files to previously hash stored in `.hash`
  - Package is locked by automatically setting property `private` to `true|false`, this is to prevent accidental deployment of package using default `npm publish` or `yarn publish` scripts.

#### Instructions for editor and IDE

`babel-preset-frontful` returns preconfigured Babel setup and can be used as any other preset in `.babelrc`. Keep in mind that Frontful infrastructure does not use `.babelrc`, but it can be useful to instruct for example [Atom](https://atom.io/)'s [source-preview](https://atom.io/packages/source-preview) plugin.
```javascript
// .babelrc
{
  "presets": [
    "frontful"
  ]
}
```

#### Configuration

`babel-preset-frontful` can be configured by setting properties from [schema](https://github.com/frontful/babel-preset-frontful/blob/master/config/index.default.js) to `frontful.babel` in `package.json`. Configuration can be done in several ways as provided by [`frontful-config`](https://github.com/frontful/frontful-config), bellow are two examples
  - Add `frontful.babel.server.options` object to `package.json`. Keep in mind that these options are not Babel options but ones accepted by [babel-preset-frontful/provider/server](https://github.com/frontful/babel-preset-frontful/blob/master/provider/server/config.development.js)
  ```javascript
  // package.json
  {
    "frontful": {
      "babel": {
        "server": {
          "options": {
            ...
          }
        }
      }
    }
  }
  ```
  - Create ES5 `config.babel.js` file, and reference this file in `frontful.babel` in `package.json`
  ```javascript
  // config.eslint.js
  const provider = require('babel-preset-frontful/provider/server')
  module.exports = {
    server: {
      config: provider({
        ...
      })
    }
  }
  ```
  ```javascript
  // package.json
  {
    "frontful": {
      "babel": "./config.babel.js"
    }
  }
  ```
