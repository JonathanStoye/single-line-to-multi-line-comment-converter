# js-comment-replacer
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

### Usage

```
node index.js testFile.js
```

Use `-o outputfile` to specify an outputfile instead of replacing the comments in the input file.

```
node index.js testFile.js -o testFile.parsed.js
```
