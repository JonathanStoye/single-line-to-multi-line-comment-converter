[![eslint version](https://img.shields.io/badge/eslint-v3.15-brightgreen.svg)](https://img.shields.io/badge/eslint-v3.15-brightgreen.svg)
[![npm version](https://img.shields.io/badge/npm-v1.1.2-brightgreen.svg)](https://img.shields.io/badge/npm-v1.1.2-brightgreen.svg)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://img.shields.io/badge/license-MIT-brightgreen.svg)

# single-line-to-multi-line-comment-converter
Replaces single line comments in js with block comments if appropriate. 

### E.g.:

```
  //
  // Request smth
  //
  // @param {mixed} array of smth
  // @return {promise}
  //
  
  // single line comment
  
  // ##################################
  //
  // Private methods
  //
  // #################################
```

will turn into

```
  /**
   * Request smth
   *
   * @param {mixed} array of smth
   * @return {promise}
   */
   
   // single line comment
   
   /**
   * ##################################
   *
   * Private methods
   *
   * #################################
   */
```

### Installation

```
npm install -g single-line-to-multi-line-comment-converter
```


### Usage

```
sl2ml testFile.js
```

or

```
sl2ml testfolder/
```

Use `-o outputfile` to specify an outputfile instead of replacing the comments in the input file. (ignored on folders)

```
sl2ml testFile.js -o testFile.parsed.js
```

or use `-p prefix` to specify a prefix attach to the processed file(s).

```
sl2ml testFile.js -p parsed
```

will result in

```
testFile.js (unchanged)
testFile.parsed.js (parsed file)
```

Use `-h --help` to display this options.
