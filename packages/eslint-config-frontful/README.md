# <a href="https://github.com/frontful/eslint-config-frontful"><img heigth="75" src="http://www.frontful.com/assets/packages/eslint-config.png" alt="Eslint Config Frontful" /></a>

[`eslint-config-frontful`](https://github.com/frontful/eslint-config-frontful) is packaged provider of [ESLint](http://eslint.org/) config. It is default linter setup for [Frontful](https://github.com/frontful) infrastructure.

### Installation

```shell
# Using yarn
yarn add eslint-config-frontful
# or npm
npm install -s eslint-config-frontful
```

### Integration

#### Instructions for editor and IDE
Add `.eslintrc` file to root of the project and extend ESLint config with `eslint-config-frontful` (`eslint-config` prefix should be omitted). Additional flags can be added to `.eslintrc`, this will only affect editor and IDE instrumentation
```javascript
// .eslintrc
{
  "extends": "frontful"
}
```

#### Configuration

`eslint-config-frontful` can be configured with one of two configuration properties
  - `options` - options that will be passed to [eslint-config-frontful/provider](https://github.com/frontful/eslint-config-frontful/blob/master/provider/index.js) that generates ESLint configuration
  - `config` - fully formed ESLint configuration that can be created manually or using [`eslint-config-frontful/provider`](https://github.com/frontful/eslint-config-frontful/blob/master/provider/index.js)

Configuration can be done in several ways as provided by [`frontful-config`](https://github.com/frontful/frontful-config), bellow are two examples

  - Add `frontful.eslint.options` object to `package.json`. Keep in mind that these options are not ESLint options but ones accepted by [eslint-config-frontful/provider](https://github.com/frontful/eslint-config-frontful/blob/master/provider/index.js)
  ```javascript
  // package.json
  {
    "frontful": {
      "eslint": {
        "options": {
          ...
        }
      }
    }
  }
  ```
  - Create ES5 `config.eslint.js` file, and reference this file in `frontful.eslint` in `package.json`
  ```javascript
  // config.eslint.js
  const provider = require('eslint-config-frontful/provider')
  module.exports = {
    config: provider({
      ...
    })
  }
  ```
  ```javascript
  // package.json
  {
    "frontful": {
      "eslint": "./config.eslint.js"
    }
  }
  ```
